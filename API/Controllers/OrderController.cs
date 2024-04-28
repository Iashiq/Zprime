using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities.OrderAggregate;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class OrderController : BaseApiController
    {
        private readonly StoreContext _contex;

        public OrderController(StoreContext storeContext)
        {
            _contex = storeContext;
        }

        [HttpGet]
        public async Task<ActionResult<List<OrderDto>>> GetOrders()
        {
            return await _contex.Orders
                .ProjectOrderToOrderDto()
                .Where(x => x.BuyerId == User.Identity.Name)
                .ToListAsync();
        }

        [HttpGet("{id}", Name = "GetOrder")]
        public async Task<ActionResult<OrderDto>> GetOrder(int id)
        {
            return await _contex.Orders
                .ProjectOrderToOrderDto()
                .Where(x => x.BuyerId == User.Identity.Name && x.Id == id)
                .FirstOrDefaultAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(CreateOrderDto orderDto)
        {
            var basket = await _contex.Baskets
                .RetrieveBasketWithItems(User.Identity.Name)
                .FirstOrDefaultAsync();

            if (basket == null)
            {
                return BadRequest(new ProblemDetails { Title = "Could not locate baskey" });
            }

            var items = new List<OrderItem>();

            foreach (var item in basket.Items)
            {
                var productItem = await _contex.Products.FindAsync(item.ProductId);
                var itemOrderedem = new ProductItemOrdered
                {
                    ProductId = productItem.Id,
                    Name = productItem.Name,
                    PictureUrl = productItem.PictureUrl
                };

                var orderItem = new OrderItem
                {
                    ItemOrdered = itemOrderedem,
                    Price = productItem.Price,
                    Quantity = item.Quantity
                };
                items.Add(orderItem);
                productItem.QuantityInStock -= item.Quantity;
            }

            var subTotal = items.Sum(item => item.Price * item.Quantity);
            var deliveryFee = subTotal > 10000 ? 0 : 500;

            var order = new Order
            {
                OrderItems = items,
                BuyerId = User.Identity.Name,
                ShippingAddress = orderDto.ShippingAddress,
                SubTotal = subTotal,
                DeliveryFee = deliveryFee,
                PaymentIntentId = basket.PaymentIntentId
            };

            _contex.Orders.Add(order);
            _contex.Baskets.Remove(basket);

            if (orderDto.SaveAddress)
            {
                var user = await _contex.Users
                    .Include(a => a.Address)
                    .FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);
                var address = new UserAddress
                {
                    FullName = orderDto.ShippingAddress.FullName,
                    Address1 = orderDto.ShippingAddress.Address1,
                    Address2 = orderDto.ShippingAddress.Address2,
                    City = orderDto.ShippingAddress.City,
                    State = orderDto.ShippingAddress.State,
                    Zip = orderDto.ShippingAddress.Zip,
                    Country = orderDto.ShippingAddress.Country
                };
                user.Address = address;

            }

            var result = await _contex.SaveChangesAsync() > 0;

            if (result)
            {
                return CreatedAtRoute("GetOrder", new { id = order.Id }, order.Id);
            }

            return BadRequest("Problem creating order");

        }
    }
}