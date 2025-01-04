import { getServerSession } from "next-auth/next";
import { wrapError, DBError } from "db-errors";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import User from "../../models/Users";

// A very simple error handler. In a production setting you would
// not want to send information about the inner workings of your
// application or database to the client.
export function onError(error, request, response, next) {
  if (response.headersSent) {
    next(error);
  }
  const wrappedError = wrapError(error);
  if (wrappedError instanceof DBError) {
    response.status(400).send(wrappedError.data || wrappedError.message || {});
  } else {
    response
      .status(wrappedError.statusCode || wrappedError.status || 500)
      .send(wrappedError.data || wrappedError.message || {});
  }
}

export default onError;

export async function authenticated(request, response, next) {
  const session = await getServerSession(request, response, authOptions);
  if (session) {
    request.user = await User.query()
      .findById(session.user.id)
      .throwIfNotFound();
    await next(); // Authenticated, proceed to the next handler
  } else {
    response.status(403).end("You must be signed in to access this endpoint.");
  }
}
