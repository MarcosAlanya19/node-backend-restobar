export enum MenuItemType {
  Beverage = 'Beverage',
  Burger = 'Burger',
  Other = 'Other'
}

export interface IBurger {
  item_name: string;
  description: string;
  price: string;
  burger_img: string;
  store_ids: string[];
  type: MenuItemType;
}

interface IBurgerUpdate {
  id: string
  item_name: string;
  description: string;
  price: string;
  burger_img: string;
  store_id: string;
  type: MenuItemType;
}
