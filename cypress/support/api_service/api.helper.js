import { configUrls } from "../../configs/config_general";

class APIHelper {
  generateAuthToken = () => {
    return cy
      .request("POST", `${configUrls.adminAPIUrl}/auth/token`, {
        email: "qacandidate@gmail.com",
        password: "p#xazQI!Y%z^L34a#",
      })
      .then((response) => response.body.token);
  };

  createCalendar = (days, name, timeZone) => {
    return this.generateAuthToken().then((token) => {
      cy.request({
        method: "POST",
        url: `${configUrls.adminAPIUrl}/v2/calendars`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          tradingDays: days,
          name,
          timeZone,
          marketOpen: "00:00",
          marketClose: "23:59",
          holidays: [],
        },
      });
    });
  };

  createActiveMP = (name, compId, Status = "Active") => {
    return this.generateAuthToken().then((token) => {
      cy.request({
        method: "POST",
        url: `${configUrls.adminAPIUrl}/mps`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          name,
          compId,
          Status,
        },
      });
    });
  };

  createApiKeyForMp = (label, mpId) => {
    return this.generateAuthToken().then((token) => {
      cy.request({
        method: "POST",
        url: `${configUrls.adminAPIUrl}/mps/${mpId}/api-keys`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          label,
          permissions: [
            "market-service:market:order_book_depth",
            "market-service:market:order_book_state",
            "market-service:market:place_order",
            "market-service:market:cancel_order",
            "market-service:market:modify_order",
            "market-service:market:replace_order",
            "market-service:market:mass_cancel",
            "market-service:market:execution_reports",
            "market-service:market:mass_order_status",
            "market-service:market:trades",
            "reporting:mp:orders",
            "reporting:mp:trades",
          ],
          cancelOnDisconnect: false,
        },
      });
    });
  };

  createInstrument = (instrument) => {
    return this.generateAuthToken().then((token) => {
      cy.request({
        method: "POST",
        url: `${configUrls.adminAPIUrl}/v2/instruments`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          symbol: instrument.symbol,
          quoteCurrency: instrument.quoteCurrency,
          calendarId: instrument.calendarId,
          pricePrecision: instrument.pricePrecision,
          quantityPrecision: instrument.quantityPrecision,
          minQuantity: instrument.minQuantity,
          maxQuantity: instrument.maxQuantity,
          activityStatus: instrument.activityStatus,
          description: instrument.description,
        },
      });
    });
  };
}
module.exports = new APIHelper();
