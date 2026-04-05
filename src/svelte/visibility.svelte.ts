// Types/constants
import type { Attachment } from 'svelte/attachments'

export const visibility = ({
	onVisible,
	onChange,
	options = {},
}: {
	onVisible?: () => void
	onChange?: (isVisible: boolean) => void
	options?: IntersectionObserverInit
}): Attachment<Element> => (
	(element) => {
		const observer = new IntersectionObserver(
			([entry]) => {
				const visible = entry.isIntersecting
				if (visible) onVisible?.()
				onChange?.(visible)
			},
			{
				rootMargin: '200px',
				...options,
				root: options.root ?? element.closest('[data-scroll-container]'),
			},
		)

		observer.observe(element)

		return () => observer.disconnect()
	}
)
