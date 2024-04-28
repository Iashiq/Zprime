using API.Data;
using API.DTOs;
using API.Entities.OrderAggregate;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace API.Controllers
{
    public class PaymentsController : BaseApiController
    {
        private readonly StoreContext _context;
        private readonly PaymentService _paymentService;
        private readonly IConfiguration _config;

        public PaymentsController(PaymentService paymentService, StoreContext Context, IConfiguration config)
        {
            _context = Context;
            _paymentService = paymentService;
            _config = config;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<BasketDto>> CreateOrUpdatePaymentIntent()
        {
            var basket = await _context.Baskets
                .RetrieveBasketWithItems(User.Identity.Name)
                .FirstOrDefaultAsync();

            if (basket == null)
            {
                return NotFound();
            }

            var intent = await _paymentService.CreateOrUpdatePaymentIntent(basket);

            if (intent == null)
            {
                return BadRequest(new ProblemDetails { Title = "Problem creating payment intent" });
            }

            basket.PaymentIntentId = basket.PaymentIntentId ?? intent.Id;
            basket.ClientSecret = basket.ClientSecret ?? intent.ClientSecret;

            _context.Update(basket);
            var result = await _context.SaveChangesAsync() > 0;

            if (!result)
            {
                return BadRequest(new ProblemDetails { Title = "Problem updating basket with intent" });
            }

            return basket.MapBasketToDto();
        }

        [HttpPost("webhook")]
        public async Task<ActionResult> StripWedbHook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            var stripEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"],
            _config["StripeSettings:WhSecret"]);

            var charge = (Charge)stripEvent.Data.Object;

            var order = await _context.Orders.FirstOrDefaultAsync(x =>
            x.PaymentIntentId == charge.PaymentIntentId);

            if (charge.Status == "succeeded")
            {
                order.OrderStatus = OrderStatus.PaymentReceived;
            }

            await _context.SaveChangesAsync();

            return new EmptyResult();
        }
    }
}