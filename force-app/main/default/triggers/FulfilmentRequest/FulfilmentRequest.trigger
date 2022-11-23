trigger FulfilmentRequest on Fulfilment_Request__c(
  before insert,
  before update
) {
  FulfilmentRequestHandler.validateProductItemExistsOnLocation(Trigger.new);
}
