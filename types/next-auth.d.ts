// This file is essential when you're using NextAuth.js with TypeScript to ensure that type definitions are accurate and provide type safety for the authentication-related objects and methods.

// usuage of this files 
//   1 -> Adding Custom JWT Types: 
//   2 -> Extending User Session Types
// when to use this ? ???
//       - When you want to customize the structure of Session, User, or JWT objects.
//       - When you need type safety for NextAuth functions like callbacks.

import "next-auth";
import { DefaultSession } from "next-auth";

declare module 'next-auth'{
    interface JWT {
        _id? : string;
        isverified? : boolean;
        isAcceptingMessages?: boolean;
        username? : string;
    }
    interface User {
        _id? : string;
        isverified? : boolean;
        isAcceptingMessages? :boolean;
        username? : string;
    }
    interface Session {
        user : {
            _id? : string;
            isverified? : boolean;
            isAcceptingMessages?: boolean;
            username? : string;
        } & DefaultSession['user']
    }
}
