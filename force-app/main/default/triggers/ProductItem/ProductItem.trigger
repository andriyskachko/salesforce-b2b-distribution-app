trigger ProductItem on ProductItem(before insert, before update) {
  ProductItemTriggerController.validateProductExistanceInInventory(Trigger.new);
}
