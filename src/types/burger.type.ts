export interface IBurger {
  burger_name: string;
  description: string;
  price: string;
  burger_img: string;
  store_id: string;
}

interface IBurgerUpdate {
  id: string
  burger_name: string;
  description: string;
  price: string;
  burger_img: string;
  store_id: string;
}
