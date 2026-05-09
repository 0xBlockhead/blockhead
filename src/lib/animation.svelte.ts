// Types/constants
import type { Attachment } from 'svelte/attachments'

import type { JsonValue } from '$/typescript/JsonValue.ts'


const unset = Symbol('animationKey.unset')

type AnimationKey = JsonValue | typeof unset

/**
 * Re-runs the element’s `animation` when the key reference changes (restarts `animation: Flash` etc.).
 * Use: `{@attach animationKey(() => someKey)}`
 */
export const animationKey = (getKey: () => AnimationKey): Attachment<HTMLElement> => (
	(element) => {
		let previousKey: AnimationKey = unset

		$effect(() => {
			const newKey = getKey()
			if (previousKey === unset) {
				previousKey = newKey
				return
			}
			if (previousKey === newKey) {
				return
			}
			const { className } = element
			element.className = ''
			void element.offsetWidth
			element.className = className
			previousKey = newKey
		})
	}
)
