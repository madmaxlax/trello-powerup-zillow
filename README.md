# Glitch Hosted Zillow API Trello Power-Up 🚀

Example Trello board that uses this power-up https://trello.com/b/u3DaGqVL/zillow-api

This power-up makes use of the Zillow API for house values/rentals. 



**NOTE**: unfortunately, zillow isn't able to "redistribute" a lot (most) of their data, [explanation here](https://www.zillow.com/advice-thread/501-on-GetUpdatedPropertyDetails/374287/), so all values are **[ZESTIMATES](https://www.zillow.com/zestimate/)** and not the actual listed values
so this API and power up isn't as cool as I was hoping it would be. also annoying that Zillow has its API in XML and not JSON format, but that is easily solved by the [xml2js npm package](https://www.npmjs.com/package/xml2js)

Getting started:

 - get a Zillow API ID [here](https://www.zillow.com/howto/api/APIOverview.htm)
 - put it in the .env file here in Glitch
 
```
SECRET=
MADE_WITH=
zwsid=xxxAPIxxKEYxxx
```


---

Want more information about Power-Ups? 🤔

👉  [https://developers.trello.com/power-ups/intro](https://developers.trello.com/power-ups/intro)

We even have office hours you can sign up for if you want to talk to a real live person about your Power-Up. Just grab a slot that works for you on this [calendar](https://calendar.google.com/calendar/selfsched?sstoken=UU5DczNLUkNIbk5ifGRlZmF1bHR8YzJmZWM4YWM0NTgxMTE1NmRmMzgxNzMwODRjYzEwZGU). (Remember to add a bit about what you'd like help with when signing up for a slot).

---

Looking for a more _realistic_ example Power-Up? You may find the Trello Card Snooze Power-Up useful. 😴

👉  [Trello Card Snooze Glitch Project](https://glitch.com/edit/#!/trellocardsnooze)
