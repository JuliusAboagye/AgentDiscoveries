import {createAPI, updateAPI} from "../crud"

export function handleReportSubmit(apiAddress, submitForm) {
  let bodyJSON = getBodyJSON(submitForm)
  bodyJSON.reportTime = new Date().toJSON()
  const requestBody = JSON.stringify(bodyJSON)

  return createAPI(apiAddress, requestBody)
      .then(response => {
        if (response.status !== 201) {
          throw "Server could not create the report. Make sure all fields are correct"
        }
      })
}

export function handleExternalReportSubmit(submitForm) {
  let bodyJSON = getBodyJSON(submitForm);
  const requestBody = JSON.stringify(bodyJSON);

  return createAPI('/v1/api/external/reports', requestBody)
      .then(response => {
        if (!response.ok) {
          if (response.status === 400) {
            throw "Could not submit report to the external API. Bad Request"
          } else if (response.status === 422) {
            throw `Could not submit report to the external API. Some fields are incorrect`
          } else {
            throw `Could not submit report to the external API. Server error`
          }
        }
      });
}

export function handleEntitySubmit(apiAddress, submitForm) {
  let bodyJSON = getBodyJSON(submitForm)
  var requestBody = JSON.stringify(bodyJSON)
  return createAPI(apiAddress, requestBody)
      .then(response => {
        if (response.status !== 201) {
          throw "Server could not create the entity. Make sure all fields are correct"
        }
      })
}

function getBodyJSON(submitForm) {
  var bodyJSON = {}
  Object.keys(submitForm).forEach((key) => {
    if (submitForm[key]) {
      let value = submitForm[key].value;
      bodyJSON[key] = getTransformedData(key, value)
    }
  })
  return bodyJSON
}

function getTransformedData(key, value) {
  var transformedData = value
  if (key === "locations") {
    transformedData = value.split(/\s/).map(function (item) {
      return parseInt(item, 10)
    })
  }
  return transformedData
}
