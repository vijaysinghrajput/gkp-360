import NextAuth from "next-auth";

export default NextAuth({
  // Custom pages for sign-in, sign-out, and errors
  pages: {
    signIn: "/login", // Custom login page
    error: "/auth/error", // Error page
    signOut: "/auth/signout", // Sign-out page
  },

  // Callbacks for session and JWT customization
  callbacks: {
    async session({ session, token }) {
      // Customize session object
      session.user.id = token.sub; // Include user ID
      return session;
    },
    async jwt({ token }) {
      // Customize JWT object
      return token;
    },
  },

  // Secret for securing JWT tokens
  secret: process.env.NEXTAUTH_SECRET,

  // Use JSON Web Token (JWT) strategy for sessions
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Update JWT every 24 hours
  },

  // Debug mode for development
  debug: process.env.NODE_ENV === "development",
});
