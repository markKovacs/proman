
# DEVELOPER NOTES


## Generic To-Do

- boards page structure change: new row is not necessary for every 4 boards!
    + appending new board situation
    + appending all boards
- window.location.replace upon board deletion ==> delete only board div
- show deletion message for boards and cards
- add card_id to cards
- enhance cards page display visually (similar to boards, maybe 4 colored columns)
- modal delete confirmation

- validate board and card title input
    + creation
    + edit
    + validation rules:
        - 1-30 characters (overflow handling if needed)

- cards should have a description
    + varchar(255)
    + shown in modal upon click on title
    + title needs hover clickable effect
    + in the modal 'Edit Description' button (textarea)

- drag and drop animation change
- teams
- accounts_teams
- search
- messages
    + ajax call every few seconds
    + toast messages
- notifications
    + ajax call every few seconds
    + toast messages
- sandwich menu in mobile view
- mobile drag and drop

## Database Changes Needed

- cards:
    + NEW: description varchar(255) NOT NULL
    + NEW: assigned_to varchar(x) default=NULL
- boards:
    + NEW: team_id integer
    + MODIFY: account_id can be NULL
    + account_id || team_id as owner (either of them is NULL) - FK needs adjustment
- accounts:
    + profile_pic (NEW)
    + description (NEW)
- accounts_teams (NEW):
    + id
    + account_id
    + team_id
    + role
    + join_date
- teams (NEW):
    + id
    + name
    + primary_category
    + secondary_category
    + description
    + owner
    + creation_date
