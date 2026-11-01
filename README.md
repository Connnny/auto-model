# auto-model

A Claude Code mod that picks the model for each prompt from the kind of job it asks for.

## What it does

When you send a prompt, Haiku (a small, fast model) reads it and sorts it into one of three groups:

| Kind of job | What happens |
| --- | --- |
| Questions, small talk or small changes (a typo, a rename, a one-line edit) | The prompt goes to **Haiku**. |
| Coding, debugging or software design | The prompt goes to **Opus 5.5**. |
| Unclear | The mod asks you which model to use: Haiku or Opus 5.5. |

- The status line shows the model the mod picked, for example `auto-model: opus 5.5`.
- The mod changes only the main chat. Subagents keep their own models.
- If you close the question, or if sorting fails, the session's normal model does the job.

## Install

At the prompt of a Claude Code terminal session:

```
/plugin install auto-model --marketplace Connnny/auto-model
```

Answer `y` to add the marketplace, then pick a scope. The mod starts at once.

From a shell:

```bash
claude plugin install auto-model --marketplace Connnny/auto-model
```

In the desktop app: click **+** next to the prompt box, then **Plugins**, then **Add marketplace** with `Connnny/auto-model`, then **Add plugin**.

## Change the models

The models and the job groups are at the top of `hooks/register.ts`. Edit the `HAIKU` and `OPUS` values to use other models. Edit the `SMALL`, `BIG` and `UNCLEAR` texts to change how prompts are sorted.

## Limits

- Each prompt makes one extra small call to Haiku, so a reply starts a little later.
- Haiku can sort a prompt into the wrong group. If that happens often, make the group texts more specific.

## License

MIT. See [LICENSE](LICENSE).
