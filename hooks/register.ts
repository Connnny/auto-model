import type { Register } from 'claude-code'

const HAIKU = 'haiku'
const OPUS = 'claude-opus-5-5'

// Each kind of job and the model that does it.
const SMALL = 'question, small talk or small change such as a typo, rename or one-line edit'
const BIG = 'coding, debugging, software design or other substantial work'
const UNCLEAR = 'unclear: could be either a small change or substantial work'
const MODEL_FOR_JOB: Record<string, string> = { [SMALL]: HAIKU, [BIG]: OPUS }

// The options the person sees when the job is unclear.
const PICK_HAIKU = 'Haiku (small job)'
const PICK_OPUS = 'Opus 5.5 (coding or design)'
const MODEL_FOR_PICK: Record<string, string> = { [PICK_HAIKU]: HAIKU, [PICK_OPUS]: OPUS }

// The model chosen for each main-loop turn, by turn id.
const chosen = new Map<string, string>()

export const register: Register = on => {
  on('turn.start', async ($, e, next) => {
    if (e.agentId === undefined && e.text.trim() !== '') {
      const job = await $.model.classify(e.text, [SMALL, BIG, UNCLEAR], { model: HAIKU })
      let model = job ? MODEL_FOR_JOB[job] : undefined

      if (job === UNCLEAR) {
        try {
          const pick = await $.ui.ask('Which model should do this job?', {
            options: [PICK_HAIKU, PICK_OPUS],
            header: 'Model',
          })
          model = MODEL_FOR_PICK[pick]
        } catch {
          // The person closed the question: keep the session's model.
        }
      }

      if (model) {
        chosen.set(e.turnId, model)
        $.ui.status(`auto-model: ${model === OPUS ? 'opus 5.5' : 'haiku'}`)
      } else {
        $.ui.status(undefined)
      }
    }
    return next(e)
  }).catch(($, e, next) => next(e))

  on('turn.step', async function* ($, e, next) {
    const model = e.agentId === undefined ? chosen.get(e.turnId) : undefined
    return yield* next(model ? { ...e, model } : e)
  })

  on('turn.complete', ($, e, next) => {
    chosen.delete(e.turnId)
    return next(e)
  })

}
