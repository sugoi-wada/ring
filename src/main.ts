import { getService } from "./lib/TwitterAppOnly"

export const hello = () => {
  console.log(`Hello World！`)
}

export const twtest = () => {
  const service = getService()
  if (service.hasAccess()) {
    const url =
      "https://api.twitter.com/1.1/users/show.json?screen_name=googleworkspace"
    const response = UrlFetchApp.fetch(url, {
      headers: {
        Authorization: "Bearer " + service.getAccessToken(),
      },
    })
    const result = JSON.parse(response.getContentText())
    console.log(JSON.stringify(result, null, 2))
  } else {
    console.log(service.getLastError())
  }
}
