// SECURITY BEST PRACTICES AND SUGGESTIONS

        // 1) COMPROMISED DATABASE - to prevent a hacker from stealing passwords or tokens from our DB
        //      a) Strongly encrypt passwords with salt and hash (bcrypt package with methods) -->
        //      b) Strongly encrypt passwordResetTokens (SHA 256 algorithm to hash) --> create with "crypto" package "Secret" 32bit String --> encrypt it with "SHA256" algorithm
                    
                    // userSchema.methods.createPasswordResetToken = function() {
                    //     const resetToken = crypto.randomBytes(32).toString("hex") ==> this is the new secret
                    //     this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex") 
                    //     ==> we encrypt the secret and update the passwordResetToken field   in our model with the new secret.
                    //     this.passwordResetExpires = Date.now() + 60 * 60 * 1000 
                    //     ==> update the passwordResetExpires field in our model with the current time. So before the document gets saved, we are updating the current time to know, when the password or a token was created.
                    //     return resetToken 
                    // }

                            // a.1) createPasswordResetToken gets called inside our forgotPassword in authController.js
                                    // const resetToken = user.createPasswordResetToken()
                                    // await user.save({validateBeforeSave: false})

                                            // a.1.1) Before save() the document, our pre hook middleware in our user model executes!
                                                        // userSchema.pre("save", async function(next) {
                                                        //     // checks if password field got modified
                                                        //     if(!this.isModified("password")) { 
                                                        //     return next()
                                                        //     // if yes the current documents password gets encrypted and we dont want to save the field confirmPassword to our DB. We just need it for checking when its created
                                                        //     } else {
                                                        //     this.password = await bcrypt.hash(this.password, 12) 
                                                        //     this.confirmPassword = undefined
                                                        //     next()
                                                        //     }
                                                        // })
                                                        
                                                        // userSchema.pre("save", function(next) {
                                                        //     // if password didnt get modified or its a new document go on to next middleware
                                                        //     if (!this.isModified("password") || this.isNew) return next() 
                                                        //     // if password got modified update currents document field passwordChangedAt with current time
                                                        //     this.passwordChangedAt = Date.now() - 1000
                                                        //     next()
                                                        // })


        // 2) BRUTE FORCE ATTACKS - hacker tries to guess password by trying million of passwords until they find the right one
        //      a) Use bcrypt (to make login requests slow)
        //      b) Implement rate limiting (express-rate-limit) // limits number of requests from one single IP
        //      c) Implement maximum login attempts


        // 3) CROSS-SITE SCRIPTING (XSS) ATTACKS - hacker tries to inject scripts to run his code. Allows attacker to read local storage.
        //      a) Store JWT in HTTPOnly cookies    // browser can only receive and send the cookie but cannot access or modify it in any way.
        //      b) Sanitize user input data         
        //      c) Set special HTTP headers (helmet package)


        // 4) DENIAL-OF-SERVICE (DOS) ATTACK - hacker sends so many requests to the server that it breaks down and the application becomes unavailable
        //      a) Implement rate limiting (express-rate-limit)
        //      b) Limit body payload (in body-parser) // in POST or PATCH methods
        //      c) Avoid evil regular expressions


        // 5) NOSQL QUERY INJECTION - hacker injects some query instead of valid data in order to create query expressions that we translate to true. Logged in without providing valid username or password.
        //      a) Use mongoose for MongoDB (because of SchemaTypes)
        //      b) Sanitize user input data



        



// OTHER BEST PRACTICES AND SUGGESTIONS

//      1) Always use HTTPS - otherwise easy to steal JWT or listen to our server
//      2) Create random password reset tokens with expiry dates
//      3) Deny access to JWT after password changed - update token with new secret when password changed
//      4) Dont commit sensitive config data to Git
//      5) Dont send error details to clients
//      6) Prevent Cross-Site Request Forgery (csurf package) - forces a user to execute unwanted actions on an application where he is currently logged in.
//      7) Require re-authentication before a high-value action - for example making a payment or deleting something
//      8) Implement a blacklist of untrusted JWT
//      9) Confirm user email address after first creating account
//      10) Keep user logged in with refresh tokens
//      11) Implement two-factor authentication - like inserting a code send per SMS to a mobilephone
//      12) Prevent parameter pollution causing Uncaught Exceptions - insert 2 field parameter into query String, which is searching for all our tours. gives error and crash application