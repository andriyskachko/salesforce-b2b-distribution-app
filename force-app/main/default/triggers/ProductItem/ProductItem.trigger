trigger ProductItem on ProductItem(before insert, before update) {
  ProductItemHandler.validateProductExistanceInInventory(Trigger.new);
}
