using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace client.src.app.models
{
    public class Basket.ts
    {
        export interface Root {
  id: number
  buyerId: string
  items: Item[]
}

export interface Item {
  productId: number
  name: string
  price: number
  pictureUrl: string
  type: string
  brand: string
  quantity: number
}
    }
}