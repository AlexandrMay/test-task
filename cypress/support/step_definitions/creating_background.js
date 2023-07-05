import { Given, And } from "cypress-cucumber-preprocessor/steps";
import {
  createCalendar,
  createActiveMP,
  createApiKeyForMp,
  createInstrument,
} from "../api_service/api.helper";
import {
  navigateToSandboxGwPage,
  createSession,
  isSessionCreated,
  createSubscriptionToExecutionReportsStream,
  createSubscriptionToTradesStream,
} from "../pages/sandbox.GW.page";
import moment from "moment/moment";
import sha256 from "crypto-js/hmac-sha256";

// Object for keeping temporary values
export const tempData = {};

// Create a prefix for test data string values from current time
const prefix = moment().format("hmmss");

Given("a calendar", (table) => {
  // Creating a random name for calendar
  const name = `mytestCalendar${prefix}`;
  // Getting the datatable hashes row
  const hashes = table.hashes()[0];
  // Splitting trading days string to array of values
  const tradingDays = hashes.TradingDays.split(",");
  // Creating a calendar via API and validate statusCode
  createCalendar(tradingDays, name, hashes.TimeZone).then((response) => {
    cy.log(`Created Calendar data: ${JSON.stringify(response.body)}`);
    cy.wrap(response.status).should("be.eq", 200);
    Object.defineProperty(tempData, "calendarId", {
      value: response.body.id,
    });
  });
});

And("an mp with an api key with full permissions", () => {
  // Creating a random name for MP
  const name = `mytestMP${prefix}`;
  Object.defineProperty(tempData, "userName", {
    value: name,
  });
  // Creating random compId for MP and validating statusCode
  const compId = `compId${prefix}`;
  createActiveMP(name, compId).then((response) => {
    cy.log(`Created MP data: ${JSON.stringify(response.body)}`);
    cy.wrap(response.status).should("be.eq", 200);
    Object.defineProperty(tempData, "userId", {
      value: response.body.id,
    });
    // Creating a random name for MP
    const label = `mytestlabel${prefix}`;
    const mpId = response.body.id;
    // Creating API key for MP with permissions and validate statusCode
    createApiKeyForMp(label, mpId).then((response) => {
      cy.log(`Created API key data: ${JSON.stringify(response.body)}`);
      cy.wrap(response.status).should("be.eq", 200);
      Object.defineProperty(tempData, "apiKey", {
        value: response.body.apiKey,
      });
      Object.defineProperty(tempData, "secret", {
        value: response.body.secret,
      });
    });
  });
});

And("an instrument", (table) => {
  // Getting the datatable hashes row
  const hashes = table.hashes()[0];
  // Creating a random symbol for instrument and saving in temp data object
  const symbol = `symbol${prefix}`;
  Object.defineProperty(tempData, "symbol", {
    value: symbol,
  });
  // Creating a test data for new instrument
  const instrumentData = {
    symbol,
    description: hashes.Description,
    calendarId: tempData.calendarId,
    pricePrecision: hashes.PricePrecision,
    quantityPrecision: hashes.QuantityPrecision,
    minQuantity: hashes.MinQuantity,
    maxQuantity: hashes.MaxQuantity,
    activityStatus: hashes.Status.toUpperCase(),
    quoteCurrency: hashes.QuoteCurrency,
  };
  // Creating instrument and validate statusCode
  createInstrument(instrumentData).then((response) => {
    cy.log(`Created Insturment data: ${JSON.stringify(response.body)}`);
    cy.wrap(response.status).should("be.eq", 200);
    Object.defineProperty(tempData, "instrumentId", {
      value: response.body.id,
    });
  });
});

And("a session to exchange GW is created successfully", () => {
  // Current date in timestamp
  const timestamp = moment().valueOf();
  // Create random sid and save it to temp data object
  const sid = Math.floor(Math.random() * 16) + 5;
  Object.defineProperty(tempData, "sessionSid", {
    value: sid,
  });
  // Get signature
  const signature = sha256(
    `"apiKey":"${tempData.apiKey}","timestamp":"${String(Date.now())}"`,
    tempData.secret
  ).toString();
  // Navigating to GW
  navigateToSandboxGwPage();
  // Creating a session
  createSession(tempData.apiKey, signature, timestamp, sid);
  // Validate that session was created successfully
  isSessionCreated(sid);
});

And("the mp subscribes to the executionReports stream", () => {
  // Create a subscription to executioReports stream
  createSubscriptionToExecutionReportsStream(tempData.sessionSid);
});

And("the mp subscribes to the trades stream", () => {
  // Create a diffrent sid value from previous session sid
  const sid = tempData.sessionSid + 1;
  Object.defineProperty(tempData, "tradesStreamSid", {
    value: sid,
  });
  // Create a subscription to executioReports stream
  createSubscriptionToTradesStream(sid);
});
