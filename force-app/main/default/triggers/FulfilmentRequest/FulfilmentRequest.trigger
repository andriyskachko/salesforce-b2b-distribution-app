trigger FulfilmentRequest on Fulfilment_Request__c(
  before insert,
  before update
) {
  FulfilmentRequestTriggerController.validateProductItemExistsOnLocation(
    Trigger.new
  );
}
