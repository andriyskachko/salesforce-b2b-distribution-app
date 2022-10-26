import { LightningElement, wire, track, api } from "lwc";
import getProductItemsInWarehouse from "@salesforce/apex/WarehouseController.getProductItemsInWarehouse";

const COLUMNS = [
  {
    label: "Product Item Number",
    fieldName: "ProductItemUrl",
    type: "url",
    typeAttributes: { label: { fieldName: "ProductItemNumber" } },
    target: "_blank"
  },
  {
    label: "Product",
    fieldName: "ProductUrl",
    type: "url",
    typeAttributes: { label: { fieldName: "ProductName" } },
    target: "_blank"
  },
  {
    label: "Quantity on site",
    fieldName: "QuantityOnHand"
  }
];

export default class WarehouseProductsTable extends LightningElement {
  columns = COLUMNS;
  @api warehouseId = "a005E00000CdjNQQAZ";
  @track data = [];

  @wire(getProductItemsInWarehouse, { warehouseId: "$warehouseId" })
  getProductItems({ error, data }) {
    if (data) {
      this.data = data.map((item) => {
        return {
          ProductName: item.Product2.Name,
          ProductUrl: "/" + item.Product2.Id,
          ProductItemUrl: "/" + item.Id,
          ...item
        };
      });
    } else if (error) {
      this.error = error;
    }
  }
}
