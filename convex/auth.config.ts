export default {
  providers: [
    {
      domain: process.env.VITE_CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ]
}