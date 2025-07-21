const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const User = require("../models/user");
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

passport.use(
  new OAuth2Strategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, displayName, emails, photos } = profile;
        const email = emails[0].value;
        const phone = profile.phone?.[0]?.value;

        let user = await User.findOne({ email });

        if (user) {
          if (!user.googleId) {
            user.googleId = id;
            user.profile = user.profile || photos[0]?.value;
            await user.save();
          }
        } else {
          user = new User({
            googleId: id,
            fullName: displayName,
            email,
            ...(phone && { phone }),
            profile: photos[0]?.value || "",
            role: "user",

            numOfProperties: 3,

            numOfContactDetails: 3,

            numOfImages: 15,

            numOfVideos: 0,

            numOfFeaturedProperties: 0,

            crmAccess: false,
            whatsappIntegration: false,

            exportCustomers: "no",
            bulkUpload: false,

            branding: "no",
          });

          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).exec();
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
