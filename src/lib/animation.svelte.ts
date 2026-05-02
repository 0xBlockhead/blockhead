// Types/constants
import type { Attachment } from 'svelte/attachments'

const unset = Symbol('animationKey.unset')

/**
 * Re-runs the element’s `animation` when the key reference changes (restarts `animation: Flash` etc.).
 * Use: `{@attach animationKey(() => someKey)}`
 */
export const animationKey = (getKey: () => unknown): Attachment<HTMLElement> => (
	(element) => {
		let previousKey: unknown = unset

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
