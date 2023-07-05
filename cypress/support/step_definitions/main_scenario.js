import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";
import { tempData } from "./creating_background";
import {
  placeOrder,
  validateExecutionReportData,
  validateTradesReportData,
} from "../pages/sandbox.GW.page";

When("the mp requested to place the following order", (table) => {
  // Getting the datatable hashes row
  const hashes = table.hashes()[0];
  // Creating a random mpOrderId
  const mpOrderId = Math.floor(Math.random() * 500) + 5;
  // Create a diffrent sid value from previous session sid
  const sid = tempData.sessionSid + 2;
  Object.defineProperty(tempData, "placeOrderSid", {
    value: sid,
  });
  // Creating test data for order
  const orderData = {
    orderType: hashes.orderType,
    side: hashes.side,
    quantity: hashes.quantity,
    price: hashes.price,
    instrument: tempData.symbol,
    mpOrderId,
    timeInForce: hashes.timeInForce,
    userId: tempData.userId,
  };
  // Place an order
  placeOrder(orderData, sid);
});

And("the mp requested to place the following order", (table) => {
  // Getting the datatable hashes row
  const hashes = table.hashes()[0];
  // Creating a random mpOrderId
  const mpOrderId = Math.floor(Math.random() * 500) + 5;
  // Creating test data for order
  const orderData = {
    orderType: hashes.orderType,
    side: hashes.side,
    quantity: hashes.quantity,
    price: hashes.price,
    instrument: tempData.symbol,
    mpOrderId: mpOrderId,
    timeInForce: hashes.timeInForce,
    userId: tempData.userId,
  };
  // Place an order
  placeOrder(orderData, tempData.placeOrderSid);
});

And(
  "the following messages should be published from executionReports stream",
  (table) => {
    table.hashes().forEach((hash, index) => {
      // Creating report data object
      const reportData = {
        messageType: hash.messageType,
        orderType: hash.orderType,
        side: hash.side,
        instrument: tempData.symbol,
        quantity: hash.quantity,
        price: hash.price,
        timeInForce: hash.timeInForce,
        filledQuantity: hash.filledQuantity,
        remainingOpenQuantity: hash.remainingOpenQuantity,
        removedQuantity: hash.removedQuantity,
        marketModel: hash.marketModel,
        mpId: tempData.userId,
        mpName: tempData.userName,
      };
      // Validate execution report data
      validateExecutionReportData(reportData, index);
    });
  }
);

And(
  "the following messages should be published from trades stream",
  (table) => {
    table.hashes().forEach((hash, index) => {
      // Creating report data object
      const reportData = {
        actionType: hash.actionType,
        mpId: tempData.userId,
        mpName: tempData.userName,
        instrumentId: tempData.instrumentId,
        instrument: tempData.symbol,
        side: hash.side,
        price: hash.price,
        quantity: hash.quantity,
        tradingMode: hash.tradingMode,
        makerTaker: hash.makerTaker,
      };
      // Validate trades report data
      validateTradesReportData(reportData, index);
    });
  }
);
