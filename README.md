# DadaVideos Bot

A Discord bot that watches a specified channel and checks YouTube videos metadata to tag the message with informations regarding duplicates and copyright material.

## Configuring Environment

The following environment variables have to be defined

`DISCORD_TOKEN`: API token for your [Discord Bot](https://discord.com/developers/applications)

## Discord Bot

The Discord Bot must be added to your server with the correct permissions to read and send messages.

You can invite one in your server using [this link](https://discord.com/oauth2/authorize?client_id=893585827433689139&scope=bot&permissions=0)

Once it's added any user with administrative capabilities can run `!channel` in the channel on which the videos will be sent, the bot will take care of everything else.

## Limitations

Since YouTube won't expose the license linked to the songs in the videos **there is no way to determine if it has been claimed from any copyright holder's agent**. The workaround implemented marks the videos as copyrighted if it finds any artist related to the songs in the video, this however doesn't take in account open licenses marking those as potentially copyrighted too.
