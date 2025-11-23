# Copy This SQL to Render Query Console

## Instructions

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click on your **PostgreSQL database** (the database, not the web service)
3. Click the **"Query"** tab
4. Copy ALL the SQL below
5. Paste it into the query box
6. Click **"Run Query"**

---

## SQL to Run

```sql
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"about" text,
	"profile_image" text,
	"is_admin" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
```

---

## After Running the SQL

### Verify Tables Were Created

In the same Query tab, run this:

```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

You should see:
- `posts`
- `users`

### Test Your App

1. Go to: **https://deja-you.onrender.com**
2. The homepage should load without errors
3. Click **"Sign Up"** and create an account
4. Log in
5. Create a post
6. See your post on the homepage

If all of this works, **you're done!** 🎉

---

## Troubleshooting

### Error: "relation already exists"

Tables are already created - you're good! Just test the app.

### Error: "permission denied"

Make sure you're running the SQL in your PostgreSQL database's Query tab, not the web service.

### App still shows errors

1. Check that both `users` and `posts` tables exist
2. Verify environment variables are set in your Web Service:
   - `DATABASE_URL`
   - `POSTGRES_URL` (same as DATABASE_URL)
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
3. Check Render logs for specific errors
