# Computer-use Testing Overview

Computer-use testing is the future verification layer of the Perceo Suite.

It will use autonomous agents to operate browser, desktop, mobile, and voice applications the way customers do, then report whether the product behavior still works.

> Info: Computer-use testing is a concept product for a later phase. It belongs in the suite because executed agent work still needs behavioral proof.

::card Archductor | See where implementation work is launched and reviewed. | /docs/archductor
::card Release readiness | Review current verification and known limits. | /docs/archductor/release-readiness
::card Archgraph | See how future verification evidence can become project memory. | /docs/archgraph

## Role in the suite

Computer-use testing verifies the work.

After Archductor executes a task, the testing layer should run real flows, capture evidence, evaluate outcomes, and feed results back into the suite.

## What it should test

- Browser flows across authenticated and unauthenticated paths.
- Desktop application workflows.
- Mobile app flows and responsive web behavior.
- Voice and multimodal app behavior.
- Regression checks for critical product journeys.

## What it is not

- It is not a replacement for unit tests, type checks, or CI.
- It is not the project memory layer. Archgraph owns structured project context.
- It is not the workbench that launches coding agents. Archductor owns execution.

## Concept status

Computer-use testing is a concept product for a later phase. It belongs in the Perceo Suite because execution without verification is incomplete.

The first useful version should focus on high-value smoke flows: sign in, create the core object, verify the expected state, and produce a clear pass/fail artifact.

```bash
# future smoke-test shape
perceo test run "sign in and create project"
```
