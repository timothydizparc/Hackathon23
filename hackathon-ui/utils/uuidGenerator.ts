// // A random value that can only be used once!
//   //
//   // Any subsequent request with the same idempotency token will fail outright.
//   // The reason for this is so that frontend "create" APIs won't accidentally resubmit
//   // the same request twice.
//   //
//   // This payload doesn't have to be a UUID, but we recommend uuid V4 (or a more modern
//   // algorithm that makes better use of entropy). The chances that your request will fail due
//   // to duplicate UUIDs is infinitsimal, so set it and don't worry about it.
//   //
//   // Notably, the UUID has a maximum length of 36 characters.
//   "uuid_idempotency_token": "9cdd9865-0e10-48f0-9a23-861118ec3286",
export default function (): string {
  let uuid = "";
  const characters = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
    const randomNumber = Math.floor(Math.random() * 16);
    const character = characters.charAt(randomNumber);
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      uuid += "-";
    }
    uuid += character;
  }
  return uuid;
}
