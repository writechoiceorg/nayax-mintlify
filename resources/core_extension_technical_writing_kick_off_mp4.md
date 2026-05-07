# Nayax - Core Extension - technical writing kick off.mp4
*Generated on 06/05/2026*

---

**Speaker 1:** Anna, Marcus is going to join.

**Speaker 1:** Check with him.

**Speaker 2:** I'm sorry, I don't know if he is, but it's okay with.

**Speaker 2:** I'm okay to proceed if you are.

**Speaker 1:** Okay.

**Speaker 2:** All right, let's.

**Speaker 1:** Let's proceed.

**Speaker 1:** We also.

**Speaker 1:** Oh, here is Shai.

**Speaker 1:** Technical IT in the core extension.

**Speaker 1:** So let's do a quick introduction.

**Speaker 1:** I'm not sure we are familiar.

**Speaker 1:** Anna, may you present yourself?

**Speaker 2:** Yes, of course.

**Speaker 2:** So hello guys.

**Speaker 2:** Part of the right choice technical writing team.

**Speaker 2:** We take care of the dev zone.

**Speaker 2:** It's a pleasure to meet you.

**Speaker 3:** Nice to meet you.

**Speaker 4:** Nice to meet you.

**Speaker 1:** Okay, Oleg and Shai, please present yourself.

**Speaker 4:** Oleg, Product Manager,.

**Speaker 3:** Chief architect.

**Speaker 1:** Okay.

**Speaker 1:** The meeting objective is to share with Anna or to kick off the technical writing for the core extension.

**Speaker 1:** It's a new way of, I would say integration or API with the our solution.

**Speaker 1:** And then we'll give OLED to start to give an overview.

**Speaker 1:** Or shy.

**Speaker 1:** Or shy.

**Speaker 4:** Show us what you got.

**Speaker 1:** Okay.

**Speaker 3:** And then present what the.

**Speaker 4:** Core extension documentation that we have and the feature itself.

**Speaker 1:** Perhaps the idea is that Anna, after this meeting and after she gets the materials, can start writing documentation for developers that will use or can use core extension.

**Speaker 1:** This material will be available in the dev zone.

**Speaker 1:** The process that she will write a draft.

**Speaker 1:** Maybe first just the structure of the.

**Speaker 1:** The way it will be in the developer zone, we will approve that and after that you will write the page itself, the content.

**Speaker 1:** She will share it with us.

**Speaker 1:** We will approve that and after that we will share it for everyone on the developer zone.

**Speaker 1:** That's the way we did the other API in the past.

**Speaker 1:** Yes, that's the process.

**Speaker 3:** Okay, so let me share.

**Speaker 3:** So first let's do a small demo just to understand the concept.

**Speaker 3:** Visualize.

**Speaker 3:** I'm in one of the screens, the machine screen and between all the options I have this one, a special option here which shows some sub screen or a pop up with this screen inside.

**Speaker 3:** The special thing about this one is it's been.

**Speaker 3:** It's a UI that is it came from external source and our platform, the web.

**Speaker 3:** The core can embed this UI.

**Speaker 4:** And.

**Speaker 3:** Allow the UI to make a request and make actions against the API.

**Speaker 3:** So it's hosting it.

**Speaker 3:** It's not hosting, it's embedding it inside.

**Speaker 3:** It's integrated it in the buttons and the pop ups.

**Speaker 3:** It gives it an authentication token which allows it to make a request to our APIs with the user context.

**Speaker 3:** This is the feature.

**Speaker 3:** It allows it to be a button with a pop up.

**Speaker 3:** It allows it to be a tab.

**Speaker 3:** This tab is also an external.

**Speaker 3:** Application and it could be a whole screen.

**Speaker 3:** I don't know.

**Speaker 3:** Maybe this one for example, good one.

**Speaker 3:** This one is a screen that is the full screen.

**Speaker 3:** The whole screen is the the application and they all received authentication tokens and they all calling APIs of NUXT on behalf of the logged in user.

**Speaker 1:** Let me try to.

**Speaker 1:** To explain if I may.

**Speaker 1:** The idea is to give external developers an option to integrate their app.

**Speaker 1:** Their solution, their.

**Speaker 1:** Let's say their app their development in the Naxco in our back office.

**Speaker 1:** That's the idea.

**Speaker 1:** So they're using maybe in the back.

**Speaker 1:** Until now we had only the option to give them access to our API like links like in the case of sqs.

**Speaker 1:** But this capability give an external developer or external team external developer the option to launch their app from the naxco with the same context.

**Speaker 1:** So the same context of the operator that is login or the user that is login with the same permission.

**Speaker 1:** So if I will give you.

**Speaker 1:** I don't know if you let me show you an example from Teams.

**Speaker 1:** For example here in Teams I have here a third party app.

**Speaker 1:** You see I can open this booking and this will be inside.

**Speaker 1:** So I think it's the same concept of integration.

**Speaker 1:** Let's say I can have iBob, it's a Jira.

**Speaker 1:** I can add top.

**Speaker 1:** This is Microsoft but I can add Jira.

**Speaker 1:** So it's like extension.

**Speaker 1:** The same idea we did in the next go I will stop sharing.

**Speaker 1:** But the same idea is to have an extension to the next goal.

**Speaker 2:** Right?

**Speaker 2:** That's the idea Separately.

**Speaker 2:** I guess this is what this is paid separately.

**Speaker 1:** Then what do this is paid?

**Speaker 2:** They need to pay for core extension like separately if they want to use it.

**Speaker 1:** That's a.

**Speaker 1:** That's.

**Speaker 1:** That might be a possible but that might be a possible but you are right that the customer out of the box they don't get the extension.

**Speaker 1:** But let's say we have an integration with this platform and it's already also supported extension then we can give them the right permission and they can see the extension.

**Speaker 1:** It's not out of the box.

**Speaker 1:** Yes.

**Speaker 1:** Can you go back shy to the example?

**Speaker 1:** Sure.

**Speaker 1:** By the way you can see it also in Outlook.

**Speaker 1:** You can see it in a lot of.

**Speaker 1:** We are a Microsoft oriented but you can see it in different apps that you have like plugins we call it extension.

**Speaker 1:** But here he gave example of three type of extension.

**Speaker 1:** It can be a tab.

**Speaker 1:** Can you show us that on the machine?

**Speaker 1:** A tab.

**Speaker 1:** Exactly.

**Speaker 1:** This is a tab.

**Speaker 1:** So you can put your extension in a Tab you can put it as a drop down item, a menu item.

**Speaker 1:** Just a second, we'll give it to.

**Speaker 1:** So it can be a menu item.

**Speaker 1:** Like this is a menu item, but this is an extension.

**Speaker 3:** It's a button with pop up.

**Speaker 1:** We call it a button with a popup button with pop up.

**Speaker 1:** But okay, so we have a button.

**Speaker 3:** The special thing about those two, the tab and the button with pop up, they are aware of the item selected in the menu.

**Speaker 3:** So when I do the request logs, it knows or it receives the the machine that I'm order or the element that I'm focused on.

**Speaker 3:** Okay.

**Speaker 3:** Also the tab.

**Speaker 3:** The tab received along with the token with the.

**Speaker 3:** With my name and credentials.

**Speaker 3:** It also received that focus element.

**Speaker 3:** So if I'm adding it to for example the operator management or the machine management or the karma whatever screen I'm at, it knows it receives the focus and the context which that screen is supposed to work on.

**Speaker 3:** And a bit different is the full screen or a screen application.

**Speaker 3:** Screen application is.

**Speaker 3:** It gets the whole window and it manage its own terry or search.

**Speaker 3:** It doesn't have any.

**Speaker 3:** It gets my context, my user context.

**Speaker 3:** But yes, no, it managed the whole screen.

**Speaker 3:** So it doesn't have other context.

**Speaker 3:** Other important stuff is the translations and role management.

**Speaker 3:** Because the developer which writes this element or application it needs to expose and support the translation and role management translation.

**Speaker 3:** It's easy to explain.

**Speaker 3:** He needs to expose the names that the text that he has in the screen for example route machines and routinfo and all the text that we have here in the screen.

**Speaker 3:** And if we expose them in the correct way then we know how to translate and return it to him in user's language.

**Speaker 3:** Okay, we return when he.

**Speaker 3:** When his application is loaded he need to request from us the the translation dictionary.

**Speaker 3:** So you're gonna have route machines in.

**Speaker 3:** In Hebrew is for example.

**Speaker 3:** And a bit like this is the role management.

**Speaker 3:** Not every application needs to do it, but we do support same for example for this tab routinfo you want to let me manage which role of users could view this tab.

**Speaker 3:** So if he expose it to me in the correct way I could bind it into the roles of the user and for example say only support users with the role of support could view this routinfo element and the same like I'm giving in the dictionary.

**Speaker 3:** I can give him the which elements should be visible and which not.

**Speaker 3:** Okay.

**Speaker 3:** And we could see it in the menu management.

**Speaker 3:** So if I'm going to be on that request device logs or maybe in the drivers.

**Speaker 3:** So over here I'm going to say the different elements that I can allow.

**Speaker 1:** Or.

**Speaker 3:** Allow each role or denying from that role.

**Speaker 3:** Okay.

**Speaker 3:** So the developer, he needs to have the documentation to tell him how to expose those UI elements and how to receive the system decision about what will happen with them.

**Speaker 1:** What Shai is presenting now is internal management.

**Speaker 1:** It's our internal management of the core extension.

**Speaker 1:** So this is not relevant for the developer, but I think Shai wants to explain you.

**Speaker 1:** Yeah.

**Speaker 3:** So you understand a bit the concept of how you manage it.

**Speaker 3:** So you understand what is it for.

**Speaker 1:** Okay.

**Speaker 3:** Also the translation, this is what manages the output of the developer.

**Speaker 3:** So here I'm getting those texts and I can translate it to any language that I want.

**Speaker 1:** And.

**Speaker 3:** And then when you're gonna load for user that speaks Danish, you're gonna get text in Danish.

**Speaker 1:** This I didn't understand.

**Speaker 1:** Regarding the extension, we manage the translation in the Naix Core or we just share the customer language.

**Speaker 4:** Now the idea is that we, if anybody wants to develop an application and be hosted within NICE Core, they need to implement two things.

**Speaker 4:** One is the permissions so that we can manage the different elements of the application with existing permission management that we have in NAIX Core and the other is translations so they need to make sure that their application fields are exposed to us so we can allow the translation.

**Speaker 4:** The existing translation mechanism that we have in the xcore.

**Speaker 1:** So anybody how they expose the fields through the.

**Speaker 4:** The instructions that you see here.

**Speaker 4:** Translation Manager.

**Speaker 4:** Essentially here are the.

**Speaker 4:** The explanation on how when you're developing an application you need to wrap your text with a specific wrapper.

**Speaker 4:** So and so that when you expose the new application then we know to read this text and we know to then manage the translation in App Score.

**Speaker 1:** Okay.

**Speaker 4:** All right.

**Speaker 3:** So we have this already done a documentation which is auto generated by AI and it's much more internal development oriented.

**Speaker 3:** It's kind of raw.

**Speaker 3:** It's not completely external developer friendly, but it's a good base to work with.

**Speaker 3:** All of the, all of the information is here we have also we have a separation that we have here for external apps and internal apps.

**Speaker 3:** When Nayax developed we used the same mechanism as for external apps, but we have some benefits that because we are hosted internally with the internal URL, so we have some additional options we could work with.

**Speaker 3:** And this documentation speaks about both of the different integrations and you need to focus only on the external application.

**Speaker 3:** But here you can see.

**Speaker 3:** So this is a mix a bit with our management and stuff like that, which is Maybe less important for the external developer for example how to edit in the menu or stuff like that.

**Speaker 2:** But that's my main question because that's where developers struggle.

**Speaker 2:** What sort of configuration do they have to do on their end in order to have core extension?

**Speaker 3:** They need to.

**Speaker 3:** It's hard to currently unless there are admins or can enter the menu screen they cannot register themselves as an application.

**Speaker 3:** We didn't give this option yet they can only run as in like they are in the call but.

**Speaker 4:** There is still so here the instructions that you see is for the actual development locally for the developer.

**Speaker 4:** We have yet to put in place a process how to onboard developers application to nuxt core.

**Speaker 4:** This is currently a manual process and something that we need to still outline if the code that is generated for the application it's.

**Speaker 4:** It's remotely hosted or locally Nike systems hosted.

**Speaker 4:** So that's something shy.

**Speaker 4:** What's the decision here?

**Speaker 4:** To use a repo that Nayax provides and the developer can upload their code there.

**Speaker 1:** And sleep remotely?

**Speaker 3:** No, we didn't decide it yet.

**Speaker 3:** We're supporting both ways.

**Speaker 3:** We're supporting external hosting and internal hosting.

**Speaker 4:** We still need to.

**Speaker 4:** Also part of the process is to.

**Speaker 4:** Let's say to onboard an application it needs to go through a set of steps and processes internally code review by NIACS security review by NAICS so it's a work in progress.

**Speaker 4:** We have not yet made some key decisions about how we're still working out kind of the internal mechanism of who's doing what.

**Speaker 2:** Okay.

**Speaker 1:** But you can assume that developer that is reading this documentation needs to understand what are the options.

**Speaker 1:** So we know we can let's do plugin or extension as a full screen, as a button, as a menu item and then it needs to develop something to support this because this.

**Speaker 1:** This is described in the documentation about the.

**Speaker 1:** The authentication but once it completed we will check that we will set it.

**Speaker 1:** We will set it up in the next call we will need to set it up to.

**Speaker 1:** We are doing that we will do it manually like shy show in a few minutes ago the screen.

**Speaker 1:** So we will need to set up the name of the application, the name of the menu, the name of the URL.

**Speaker 1:** But once the customers click it's go to the other to the external developer URL and he needs to know how to catch it, how to catch the security, how to catch the operator id, how to catch the.

**Speaker 1:** The context of the session, how to catch the.

**Speaker 1:** The translation even so that that's the idea.

**Speaker 2:** Hello.

**Speaker 4:** Hi.

**Speaker 1:** Sorry for being late guys.

**Speaker 1:** Yes, we will not start from the beginning, but we recorded the session so you will.

**Speaker 1:** You can listen to that after that, no problem.

**Speaker 1:** Okay.

**Speaker 1:** Okay.

**Speaker 1:** Yes Anna, if you have question.

**Speaker 2:** So they have to go through a set of configurations but you guys are going to do the heavy lifting.

**Speaker 2:** Let's say bring it online.

**Speaker 2:** All right.

**Speaker 4:** Yes, initially, but we will put in place some procedures which we can then publish to everyone that they know.

**Speaker 4:** What's the steps in the process, how to submit it to review, how to.

**Speaker 4:** There are also certain considerations we need to make in terms of.

**Speaker 4:** Perhaps there is a commercial agreement, perhaps there is a legal agreement between NAICS and the developer that still needs to come into effect.

**Speaker 4:** And these are not things we've yet to define properly.

**Speaker 1:** But in general is the same process almost in like every other API, every other integration that we have.

**Speaker 1:** First the customer will send him a welcome email explaining him what he needs to do.

**Speaker 1:** We will set up a sandbox environment for him so he can develop and test it.

**Speaker 1:** Then we will have a certification like we are verifying what he did and then we will deploy to production.

**Speaker 1:** So setting up the sandbox environment is.

**Speaker 1:** Will be the configuration also moving in production it will be manual configuration done by us Shy.

**Speaker 1:** Maybe you can go over the details documentation like what you have in the documentation, what the.

**Speaker 1:** What the developer needs to do.

**Speaker 2:** Yes, yes, if you could clarify these sections that will be helpful.

**Speaker 3:** I'm gonna need a couple of minutes.

**Speaker 3:** My daughter came to address her Ola.

**Speaker 3:** Can you share it?

**Speaker 4:** Sorry, come again?

**Speaker 4:** What do you want to share?

**Speaker 1:** What developer needs to do?

**Speaker 2:** Just go over the documentation and the sections you have already documented.

**Speaker 2:** If you could point out what is done by you guys and what the developer needs to do.

**Speaker 2:** Of course we'll handle that as well, but it would be nice to.

**Speaker 4:** Just.

**Speaker 2:** Have some context for you guys as well.

**Speaker 4:** So essentially the app next core app framework.

**Speaker 4:** Contains, as SHA explained earlier, the different types internal application, external application defines what menu types there are.

**Speaker 4:** So essentially.

**Speaker 4:** Taking into account that we're talking about an existing system and it's an application that is going to be hosted within an existing application.

**Speaker 4:** Actually, let me show you, perhaps I'll show you an example.

**Speaker 4:** So this is Naix's backend system.

**Speaker 4:** You're probably familiar with it, but the idea is it's certain functionalities are still missing from it and we would like to give the developer community the ability to extend the functionality of the nice backend system.

**Speaker 4:** One of the things that this is one of my applications.

**Speaker 4:** I have developed this application using AI, but essentially this is a management screen that shows software updates that have been queued and are in progress or have been completed with details about which device, to which version did it succeed and whatnot.

**Speaker 4:** Essentially you're seeing this as like a part of the overall Nayax core, but essentially this is a encapsulated application that I have developed and I've uploaded to Naics Core.

**Speaker 4:** In order to this application to appear in the in Naix Core, what I had to do is several things.

**Speaker 4:** One, in this instance the application that I did developed I needed the repo which I provided to me where I can upload the code.

**Speaker 4:** And the other thing I needed to do is create a menu item in the Naics platform to be able to reference and to link to this application the menu item.

**Speaker 4:** Here.

**Speaker 4:** We have a menu management screen.

**Speaker 4:** Essentially I've added a menu item called rollouts.

**Speaker 4:** I have some references to the application, what's the model of the application, what's the URL, the route and even what's the icon that I see here.

**Speaker 4:** Now I have a definition of what this application is.

**Speaker 4:** In my particular case I'm utilizing the entire screen.

**Speaker 4:** Meaning you can see here it's taking the entire screen.

**Speaker 4:** But there are other types of applications where it can be hosted within an existing already pre developed screen.

**Speaker 4:** So this is for example a screen of machines and there are several types.

**Speaker 4:** One of the types is a full screen, another type is a tab.

**Speaker 1:** It's loading Explain the what developers needs to do go over the I understand.

**Speaker 4:** But in order to explain what developer needs to do.

**Speaker 4:** I'm also I don't have a like I said, I don't have a full hour.

**Speaker 4:** I only can be the first I need to go to another meeting.

**Speaker 1:** But.

**Speaker 4:** It's man maybe shy will continue after we're explaining this.

**Speaker 4:** So I'm just showing a couple of examples.

**Speaker 4:** This is an application where it's an iframe in a in a tab that's another application.

**Speaker 4:** And there is another type of application which is where is the where it's the application is up in a pop up.

**Speaker 4:** So the definition is here I can say is it a screen?

**Speaker 4:** Is it a tap?

**Speaker 4:** Is it a button with pop up?

**Speaker 4:** So I can define what type of application.

**Speaker 4:** It doesn't have to be.

**Speaker 4:** It can be something small in an existing screen.

**Speaker 4:** Once you know what you're developing, you have essentially let's say an app in mind.

**Speaker 4:** The app needs to do something.

**Speaker 4:** So you need to build that app.

**Speaker 4:** You need to use the NAICS APIs in order to perform certain Actions.

**Speaker 4:** So the developer needs to build the application, make relevant functionality by making the application doing API calls.

**Speaker 4:** One of the benefits of being hosted within nice backend system is that we're also giving you two things as an application.

**Speaker 4:** One is a token.

**Speaker 4:** So essentially because we identify the user and you're launching the application, the application is in the context of the user.

**Speaker 4:** So we give the application a token, user's context token, with which the application can make now API calls.

**Speaker 4:** That's one.

**Speaker 4:** And the other is in some cases, if it's.

**Speaker 4:** Like I said, if it's in the context of an existing screen, right now I'm on a specific machine.

**Speaker 4:** One of the things that we're giving to the iframe, besides the token is the context.

**Speaker 4:** So we're essentially giving the application the ability to know that I'm currently on this machine, so then the app can load contextual data.

**Speaker 2:** Okay, all right, that is nice.

**Speaker 2:** You were mentioning that it had context, but now you clarified what this context is.

**Speaker 4:** Correct.

**Speaker 4:** So that's how creating an application, essentially you need to utilize, let's say NAX APIs to, I don't know, restart a device, send a configuration, update some value in the database using APIs, and then because you're hosted in Naix iFrame, you're getting a token with which you can operate and make API calls, and you're getting context when necessary.

**Speaker 4:** In other cases, like the application I showed you before the rollouts, I don't need context.

**Speaker 4:** I take up the entire screen.

**Speaker 4:** I am the application.

**Speaker 4:** I just need a, A menu item just to know that it can be open, it can open.

**Speaker 4:** So the developer needs.

**Speaker 3:** Guys, I'm sorry, I need to move to another meeting.

**Speaker 3:** We can schedule a continue if, if we need to fill up.

**Speaker 3:** I really have to go.

**Speaker 3:** Sorry.

**Speaker 1:** Yeah, okay.

**Speaker 4:** Okay.

**Speaker 4:** And I think we're gonna have to do another session.

**Speaker 4:** I'll finish up just by saying that where is the.

**Speaker 4:** This explains the different types of applications.

**Speaker 4:** And now that you understand where it's going to be, it depends on what you want to build.

**Speaker 4:** This gives you.

**Speaker 4:** You should be able to know what you can do because you know which APIs nice provides to you.

**Speaker 4:** So links APIs, essentially, if you want to create a UI for a functionality that doesn't exist in Naics and you have the links API for that, you can use this to build that application and don't make those API calls.

**Speaker 3:** Then.

**Speaker 4:** Essentially, in the age of AI, would give this as a context to the.

**Speaker 4:** Develop to the, to the, to the AI and say, I'D like to build an application.

**Speaker 4:** Here's the foundation.

**Speaker 4:** I'd like to do abcd.

**Speaker 4:** And then you would use that documentation.

**Speaker 4:** The AI would use this documentation as a.

**Speaker 4:** As a foundation to which build the application.

**Speaker 4:** And there are two things we mentioned before.

**Speaker 4:** One is the ability to.

**Speaker 4:** When you're creating the application, NAICS Core has roles and permissions.

**Speaker 4:** By exposing those permissions, it would essentially give me the ability to control access to the application.

**Speaker 4:** The second thing is translation.

**Speaker 4:** So if I go and do the things according to the documentation, then I'm able to translate all of the different fields of my screen.

**Speaker 4:** And then that's kind of permissions.

**Speaker 2:** It's not the same thing.

**Speaker 2:** It's not the first time they're setting permissions, right?

**Speaker 2:** They probably already have those set up.

**Speaker 4:** Well, no, because it's essentially we have permissions to NICE Core and all of those screens.

**Speaker 4:** But now if you're adding a new application, we need to be able to say how do we expose this application to a new user?

**Speaker 4:** By adding this screen to either an existing permission or creating a new permission for that application.

**Speaker 2:** Okay.

**Speaker 2:** All right,.

**Speaker 4:** I really gotta go, but.

**Speaker 1:** Let's do like that.

**Speaker 1:** Please review the documentation.

**Speaker 2:** Yes.

**Speaker 1:** See if you have questions.

**Speaker 1:** Write them by email for some explanation or things like that.

**Speaker 1:** And if needed, we will do another meeting.

**Speaker 1:** Let us know.

**Speaker 2:** All right?

**Speaker 2:** Yes.

**Speaker 2:** If.

**Speaker 2:** If I access my X Core now, will I see any of these screens?

**Speaker 2:** I don't think so.

**Speaker 2:** Right?

**Speaker 4:** No, it's in the development environment and it's.

**Speaker 2:** Okay.

**Speaker 2:** Moshe, could you send us this recording?

**Speaker 2:** Because it would be helpful to actually see the screen.

**Speaker 1:** Okay, I will send the recording.

**Speaker 1:** I can download it and then share it with you.

**Speaker 1:** I think that's one.

**Speaker 1:** But do you have access to Confluence, the link that he shared?

**Speaker 1:** You see it in the chat?

**Speaker 2:** Let me try it.

**Speaker 4:** I'm sorry.

**Speaker 1:** And bye bye.

**Speaker 4:** Thank you.

**Speaker 1:** Bye bye.

**Speaker 2:** Bye bye.

**Speaker 2:** I can check if I have access and if I don't, I can message you guys.

**Speaker 2:** But I should have.

**Speaker 1:** Okay, so I don't have.

**Speaker 1:** So I don't know if you will.

**Speaker 3:** Have it on verifying before requesting you.

**Speaker 1:** You don't have access.

**Speaker 1:** So let me.

**Speaker 1:** No, I don't.

**Speaker 1:** Maybe the easy way is to take this.

**Speaker 1:** I don't think you have to export it to PDF.

**Speaker 1:** Maybe.

**Speaker 1:** Let me see.

**Speaker 2:** Maybe there's a request access.

**Speaker 2:** No, we don't have access to it yet.

**Speaker 1:** Okay, just a second.

**Speaker 1:** Let me see if I can.

**Speaker 1:** And another.

**Speaker 1:** Another question not related directly to this.

**Speaker 1:** Can you share with Marianne Spinner the fiscal Tina links you remember there was a fiscal Tina that you worked in the past yes I don't know if I assume we migrated that to to mintify but I assume it's it's not it's hidden yeah so can you share it with her you want me I will compute yes let me put her name here let's see her email just a second I will put the email hearing the in meeting because she wants to do some changes let's see edit rename and style how do I export that ah.

**Speaker 1:** Export I can export to world you prefer the world.

**Speaker 1:** Let me see.

**Speaker 1:** I export that but I want to see I did export everything now I just did this just a second.

**Speaker 1:** Okay I will send you by email.

**Speaker 2:** All right thank you okay.

**Speaker 1:** But sure if this is relevant no okay I will send it thank you thank you bye bye thank you in a bit join ah you are joining the meeting.

**Speaker 4:** Also yeah we have the.

**Speaker 3:** Bye bye bye bye.
