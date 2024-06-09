export interface OrderItem {
  item_id: number;
  quantity: number;
}

export interface IOrder {
  id: number;
  user_id: number;
  order_date: Date;
  status: 'pending' | 'in_process' | 'delivered';
  items: OrderItem[];
}
