# Technical Decisions

## Stack Choice

I chose the MERN stack (MongoDB, Express, React, Node.js) for this project. React with Vite gives a fast development cycle and clean component-based structure — splitting the Admin and Student views into separate components kept the logic easy to reason about. Express + MongoDB made it straightforward to model the event and registration data without rigid schema overhead, and Mongoose's `populate` made resolving references (e.g. fetching user details from registrations) simple and readable.

## One Decision Not Specified in the Brief

I chose JWT (JSON Web Tokens) for authentication rather than server-side sessions. The brief allowed either. JWT creates a stateless backend — the server doesn't need to store session state, which keeps the API clean and each route independently verifiable. The token carries the user's role and ID, so the auth middleware can gate admin-only routes without an extra database lookup per request.

## One Thing I'd Improve With More Time

I'd add input validation and sanitisation on the backend using a library like `express-validator`. Right now the API trusts that incoming data is well-formed. With more time I'd validate that `capacity` is a positive integer, event dates are in the future, and field lengths are bounded — and return clear 400 errors with field-level messages rather than letting Mongoose surface raw errors.
