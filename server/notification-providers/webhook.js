const NotificationProvider = require("./notification-provider");
const axios = require("axios");
const FormData = require("form-data");

class Webhook extends NotificationProvider {

    name = "webhook";

    async send(notification, msg, monitorJSON = null, heartbeatJSON = null) {
        let okMsg = "Sent Successfully.";

        try {
            let data = {
                heartbeat: heartbeatJSON,
                monitor: monitorJSON,
                msg,
            };
            let finalData;
            let config = {
                headers: {}
            };

            if (notification.webhookContentType === "form-data") {
                finalData = new FormData();
                finalData.append("data", JSON.stringify(data));
                config.headers = finalData.getHeaders();
            } else {
                finalData = data;
            }

            if (notification.webhookAdditionalHeaders) {
                try {
                    config.headers = {
                        ...config.headers,
                        ...JSON.parse(notification.webhookAdditionalHeaders)
                    };
                } catch (err) {
                    throw "Additional Headers is not a valid JSON";
                }
            }

            await axios.post(notification.webhookURL, finalData, config);
            return okMsg;

        } catch (error) {
            this.throwGeneralAxiosError(error);
        }

    }

}

module.exports = Webhook;
