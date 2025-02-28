# multi-turn gen ai

The purpose of this little experiment is to find a reliable way to allow an AI to conduct research by asking a user questions before responding with a final response.

Technique is to provide function callbacks for the AI to either clarify questions, or finally complete the conversation.

## Background

The code uses test-driven message-oriented javascript (see https://goofballlogic.github.io/modd/ or https://github.com/goofballLogic/modd-core/blob/main/lib/hub.js)

## Design

The main responsiblities of the system:

--- 

### Agent
Marshalls messages to and from the (remote) LLM.

Receives:
- USER_RESPONDED

Sends:
- LLM_RESPONDED

---

### Console
Marshalls message to and from the user

Receives:
- QUESTION_RAISED
- OUTCOME

Sends:
- QUESTION_ANSWERED

---

### Coordinator
Coordinating the back-and-forth between console and agent. Starts by prompting for the initial question from the user. Then waits for the conversation to be resolved and plays back the whole conversation to the user.

Receives:
- QUESTION_ANSWERED
- LLM_RESPONDED

Sends:
- QUESTION_RAISED
- USER_RESPONDED
- OUTCOME

---

### Callback Function
Specifies how an LLM can call it, and handles the response from the LLM to invoke the specified function

Receives:
 - LLM_RESPONDED
 - (configurable, e.g. QUESTION_ANSWERED)

Sends:
 - (configurable, e.g. QUESTION_RAISED)


---

### Test objects
Carry out POST checks when the system starts up to verify implementation

Receives:
 - POST

Sends:
 - POST_OUTCOME

---