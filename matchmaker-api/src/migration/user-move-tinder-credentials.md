## Move *Tinder* credentials

* from

	```json
	{
		"token": "...",
		"tinderUserId": "..."
	}
	```
	
* to

	```json
	{
		"credentials": {
			"tinder": {
				"token": "...",
				"userId": "..."
			}
		}
	}
	```

Command:
```bash
db.user.updateMany(
    {},
    {
        $rename: {
            "token": "credentials.tinder.token",
            "tinderUserId": "credentials.tinder.userId"
        }
    }
)
```