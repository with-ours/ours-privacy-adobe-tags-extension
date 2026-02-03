# Ours Privacy Extension for Adobe Experience Platform Tags

Integrate [Ours Privacy](https://oursprivacy.com) analytics and user identification into your website using Adobe Experience Platform Tags (formerly Adobe Launch).

## Installation

1. In your Adobe Tags property, go to **Extensions > Catalog**
2. Search for **"Ours Privacy"**
3. Click **Install**
4. Enter your **Project Token** (found in the [Ours Privacy dashboard](https://app.oursprivacy.com) under Settings)
5. Click **Save**

## Actions

### Initialize

Loads the Ours Privacy SDK and initializes it with your project token. This action must fire before any Track or Identify actions.

**Recommended setup:** Add this action to a rule that fires on every page using the **Library Loaded** or **Page Bottom** event.

No additional configuration is needed -- the project token is read from the extension settings.

### Track Event

Sends a custom event to Ours Privacy.

| Field | Required | Description |
|-------|----------|-------------|
| Event Name | Yes | The name of the event (e.g., `page_view`, `button_click`, `purchase`) |
| Event Properties | No | Key-value pairs of event metadata (e.g., `page = /pricing`) |
| User Properties | No | Key-value pairs of user attributes to include with the event |

### Identify User

Associates user attributes with the current visitor.

| Field | Required | Description |
|-------|----------|-------------|
| User Properties | Yes | Key-value pairs of user attributes (e.g., `email`, `name`, `plan`) |

## Data Elements

All text fields support Adobe Tags data elements. Use the `%dataElementName%` syntax to dynamically populate values. For example:

- Event Name: `%eventName%`
- User Property value: `%user.email%`

## Ordering

Make sure the **Initialize** action fires before any **Track** or **Identify** actions. If a Track or Identify call is made before the SDK has loaded, the call is queued and sent automatically once initialization completes.

## Development

### Prerequisites

- Node.js with npm 5.2.0+

### Local Development

```bash
# Install dependencies
npm install

# Start the local sandbox for testing views and library modules
npm run dev

# Validate the extension structure
npm run validate

# Package the extension into a .zip
npm run package
```

### Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:ci
```

## Support

- Documentation: [docs.oursprivacy.com](https://docs.oursprivacy.com)
- Email: [support@oursprivacy.com](mailto:support@oursprivacy.com)
- Website: [oursprivacy.com](https://oursprivacy.com)

## License

Copyright Ours Privacy. All rights reserved.
