# SoloPadel \- Specifications

# Core Concept

A web app that lets Linköping singles padel players:

* Track their rating  
* Find other players with similar rating and availability  
* Compete to climb leaderboards


# Technical specifications

**Frontend:**

* React  
  * Language: TypeScript  
  * Development tool: Vite

**Backend**

* Supabase  
  * Database: Supabase Postgres   
  * Authentication: Supabase Auth  
  * Realtime functionality: Supabase subscriptions

# Minimal Functionality

**Register:**

* Inputs personal information   
  * Name, email, password phone number, etc  
* Input skill level to determine starting rating  
  * New (500), beginner (800), intermediate (1000) etc

**Login**

**Facility Discovery View**

* List all the padel facilities  
* Displays number of members in each facility (Real time)  
* Clicking on a facility takes you to “facility leaderboard” view

**Facility Leaderboard View**

* Shows a leaderboard of all members based on rating (Real time)  
* A user can join the facility so they appear on the leaderboard  
* A user can challenge a player on the leaderboard which takes you to “send challenge” view

**Send Challenge View**

* Select a time  
* Send message creates a chat in “challenges” view

**Challenges View**

* A list of all the incoming and outgoing challenges (Real time)  
* Clicking on a challenge expands the corresponding “chat” view

**Chat View (Real time)**

* The receiver of the challenge can accept or deny the challenge  
* The sender can cancel the challenge  
* Both can send messages to each other  
* Once the receiver accepts, both players can report results  
  * When a result is reported the rating of both players is updated which updates the leaderboard for each facility they are in (Real-time).

**Account Settings View**

* View and edit account information.

# Extra functionality (if time allows)

* Deployment  
* Additional cities  
  * A city search bar in the facility discovery page  
* Profile View  
  * Clicking a player in the leaderboard opens a profile view instead of immediately sending the challenge  
  * Shows a personal info, profile image, short “about me”, additional statistics, facility memberships etc.  
  * A challenge button.  
* Additional statistics (shown in leaderboard or profile view) (dynamic):  
  * Win loss record  
  * Winning percentage  
  * Form (shows result of last 5 games)  
  * Response time (how long it takes for the person to respond to challenges)  
  * Activity (how much the player is playing)  
* Schedule  
  * Players can set which times they usually are available to play.  
  * A player can see in the leaderboard if a player has overlapping availability.  
  * In the profile view a player can see what overlapping availability exists  
* QuickFind  
  * Based on schedule, rating, facility memberships and more, retrieves a list of players which are suitable to challenge.  
* Trustworthiness  
  * If two player report conflicting match result, both players rating are unchanged and both players receive a small trustworthiness penalty  
* Notifications  
  * Email notifications when receiving new messages, challenges etc.  
* Reviews  
  * A player can leave 1-5 stars on a player they have played against to reflect sportsmanship of a player.