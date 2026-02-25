// Clerk RBAC Role Types
export type Roles = 'admin' | 'user';

// Extend Clerk's session claims to include our custom metadata
declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}

export { };
