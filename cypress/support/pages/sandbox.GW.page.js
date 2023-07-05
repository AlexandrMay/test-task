import { configUrls } from "../../configs/config_general";

export class SandboxGwPage {
  // Page elements
  get #loggerColumn() {
    return cy.get('[data-cy="logger-column"]', { timeout: 60000 });
  }
  get #createSessionButton() {
    return cy.get('[data-cy="method-item-Authentication API/createSession"]');
  }
  get #messageTextarea() {
    return cy.get(".ace_text-input");
  }

  get #sendMessageActiveButton() {
    return cy.get('[data-cy="request-form-submit-btn-active"]');
  }
  get #loggerRawMessage() {
    return cy.get('[data-cy="logger-row-message"]', { timeout: 80000 });
  }

  get #executionReportsButton() {
    return cy.get('[data-cy="method-item-Private Data API/executionReports"]');
  }

  get #tradesButton() {
    return cy.get('[data-cy="method-item-Private Data API/trades"]');
  }

  get #placeOrderButton() {
    return cy.get('[data-cy="method-item-Trading API/placeOrder"]');
  }

  // Page actions
  navigateToSandboxGwPage = () => {
    cy.visit(configUrls.sandboxUrl);
    this.#loggerColumn
      .find('[data-cy="logger-row-message"]')
      .contains("Connected")
      .should("be.visible");
  };

  createSession = (apiKey, signature, timestamp, sid) => {
    this.#createSessionButton.click();
    this.#messageTextarea.clear({ force: true });
    this.#messageTextarea.type(
      `{"d": {"apiKey": "${apiKey}", "signature": "${signature}", "timestamp": "${timestamp}"},"q": "exchange.market/createSession","sid": ${sid}}`,
      { parseSpecialCharSequences: false, force: true }
    );
    this.#sendMessageActiveButton.click();
  };

  isSessionCreated = (sid) => {
    this.#loggerRawMessage
      .contains('"sig":')
      .should("contain", `"q":"exchange.market/createSession","sid":${sid}`);
  };

  createSubscriptionToExecutionReportsStream = (sid) => {
    this.#executionReportsButton.click();
    this.#messageTextarea.clear({ force: true });
    this.#messageTextarea.type(
      `{"d": {"trackingNumber": 0},"q": "v1/exchange.market/executionReports","sid": ${sid}}`,
      { parseSpecialCharSequences: false, force: true }
    );
    this.#sendMessageActiveButton.click();
  };

  createSubscriptionToTradesStream = (sid) => {
    this.#tradesButton.click();
    this.#messageTextarea.clear({ force: true });
    this.#messageTextarea.type(
      `{"d": {"trackingNumber": 0},"q": "v1/exchange.market/trades","sid": ${sid}}`,
      { parseSpecialCharSequences: false, force: true }
    );
    this.#sendMessageActiveButton.click();
  };

  placeOrder = (orderData, sid) => {
    this.#placeOrderButton.click();
    this.#messageTextarea.clear({ force: true });
    this.#messageTextarea.type(
      `{"d": {"orderType": "${orderData.orderType}","side": "${orderData.side}","quantity": ${orderData.quantity},"price": ${orderData.price},"instrument": "${orderData.instrument}","mpOrderId": ${orderData.mpOrderId},"timeInForce": "${orderData.timeInForce}","userId": "${orderData.userId}"},"q": "v1/exchange.market/placeOrder","sid": ${sid}}`,
      { parseSpecialCharSequences: false, force: true }
    );
    this.#sendMessageActiveButton.click();
  };

  validateExecutionReportData = (reportData, index) => {
    // This tiemout was added for waiting of building report data
    cy.get(`p:contains({"q":"v1/exchange.market/executionReports")`, {
      timeout: 80000,
    })
      .eq(index)
      .should("contain", `"messageType":"${reportData.messageType}"`)
      .and("contain", `"orderType":"${reportData.orderType}"`)
      .and("contain", `"side":"${reportData.side}"`)
      .and("contain", `"instrument":"${reportData.instrument}"`)
      .and("contain", `"quantity":${reportData.quantity}`)
      .and("contain", `"price":${reportData.price}`)
      .and("contain", `"timeInForce":"${reportData.timeInForce}"`)
      .and("contain", `"filledQuantity":${reportData.filledQuantity}`)
      .and(
        "contain",
        `"remainingOpenQuantity":${reportData.remainingOpenQuantity}`
      )
      .and("contain", `"removedQuantity":${reportData.removedQuantity}`)
      .and("contain", `"marketModel":"${reportData.marketModel}"`)
      .and("contain", `"userId":"${reportData.mpId}"`)
      .and("contain", `"mpId":${reportData.mpId}`)
      .and("contain", `"mpName":"${reportData.mpName}"`);
  };

  validateTradesReportData = (reportData, index) => {
    cy.get(`p:contains({"q":"v1/exchange.market/trades")`)
      .eq(index)
      .should("contain", `"actionType":"${reportData.actionType}"`)
      .and("contain", `"mpId":${reportData.mpId}`)
      .and("contain", `"mpName":"${reportData.mpName}"`)
      .and("contain", `"instrumentId":${reportData.instrumentId}`)
      .and("contain", `"instrument":"${reportData.instrument}"`)
      .and("contain", `"side":"${reportData.side}"`)
      .and("contain", `"price":${reportData.price}`)
      .and("contain", `"quantity":${reportData.quantity}`)
      .and("contain", `"tradingMode":"${reportData.tradingMode}"`)
      .and("contain", `"makerTaker":"${reportData.makerTaker}"`);
  };
}
module.exports = new SandboxGwPage();
