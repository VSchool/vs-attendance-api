# VS Attendance API

### Overview
Node server API for logging attendance, generating QR codes, and validating access tokens. This service acts as an interface between a MongoDB database, google spreadsheet, and two client web applications: 
- [User Client](https://github.com/bbgrabbag/vs-attendance-client-user.git)
- [Admin Client](https://github.com/bbgrabbag/vs-attendance-client-admin.git)


### Sytem Architecture
![Architecture](./docs/Architecture_Diagram.png)

### Getting Started
```bash
# create and populate .env files (see .env.template file for reference)
touch .env .env.ci .env.qa
cat .env.template >> .env
cat .env.template >> .env.qa
cat .env.template >> .env.ci

# generate .env.vault (remember to run this whenever there is a change to an .env.* file) 
npm run set-env

# start dev server
npm run dev

# run unit tests
npm t

# run linter
npm run lint

# run formatter
npm run format
```

### API Endpoints
> See [architecture diagram](#sytem-architecture) for `Entry` Schema.

```
EntryType = 'CHECK_IN' | 'CHECK_OUT'
Fields = {
    firstName: String, 
    lastName: String,
    email: String
}
```

|  Method | Path  | Description | Headers | Request Body  | Response Data |
|---|---|---|---|---|---|
|`GET`|`/docs`|Retrieve API documentation|||`<html>`|
|`GET`|`/api/qr-code/generate`|Provides a dataURL of a QR code which encodes the User Client website URL and time-limited `access_token`:  `https://<client_url>?access_token=<access_token>`|||```{dataUrl:String}```|
|`GET`|`/api/qr-code/validate`|Validates `access_token`|`{Authorization: Bearer <access_token>}`||`{success:true}`|
|`GET`|`/api/attendance/entries`|Retrieves all `Entry` records|||`{entries:Entry[]}`|
|`POST`|`/api/attendance/log-entry`|Creates a new timestamped `Entry`|`{Authorization: Bearer <access_token>}`|```{ "fields": Fields,"type": EntryType}```|``{success:true}``|
