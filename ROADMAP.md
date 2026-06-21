# ChatToCart — What's Next

ChatToCart already does the core job well: it takes messy WhatsApp order chats and turns them into clean, structured orders, and when it's not confident about something, it flags it instead of guessing. That part's solid.

But while building this, we ran into two real scenarios that we didn't have time to fully solve in 4 days. Here's what they are and why we left them for later.

## 1. Letting staff fix flagged orders directly

Here's the scenario: a customer's order gets flagged because they said something like "the usual" and we don't know what that means yet. So staff calls them up, sorts it out, "oh you wanted the nasi lemak, deliver to your usual place." Cool, problem solved... except right now, there's no way to actually update that order in ChatToCart. You can mark it Done, but the system still thinks it's unresolved underneath.

The fix is obvious in theory, let staff type the correct item and address right into the table, and have the flag clear automatically once it's filled in. In practice it's trickier than it sounds, the AI's flag reasons are written in plain freeform text, not some neat fixed list, so figuring out "okay, this is actually resolved now" programmatically isn't trivial. We also realized our data only stores the final price per item, not the price-per-unit, so recalculating totals on an edit needs a bit more thought too.

We scoped it at roughly 3-5 hours of real work. Didn't want to rush it and risk breaking something that already works well, so it's first on the list for after the hackathon.

## 2. Giving the system memory of repeat customers

This one's the natural next step. Right now, every chat is parsed completely fresh, ChatToCart has zero memory of who ordered what before. So when someone says "the usual," there's genuinely no way for it to know what that means, it's not being lazy, it just has no history to check.

The real fix is to actually remember each customer's past orders and let the AI reference that history. Then "the usual" stops being a flag and starts being something it can actually resolve correctly.

This one's bigger though. WhatsApp names aren't reliable, "Kak Ros," "Ros," and "Sis Ros" might all be the same person, so matching customers consistently needs real thought. We'd also need to be careful not to overload the AI prompt with too much history, and honestly, this needs a proper backend instead of just localStorage. We're estimating 6-10 hours for this one, it's a bigger chunk of work for round two.

## The bigger picture

Both of these point toward the same idea: ChatToCart shouldn't just be smart for one chat at a time, it should get smarter about a specific business's actual regulars over time. And whatever we add, the one thing we're not compromising on is the core promise, it should never guess when it's not sure.
