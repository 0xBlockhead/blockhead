export type RouteScreenshotQualityInput = {
	boundaryEvents: readonly {
		kind: string
	}[]
	contentHeight: number
	mainText: string
	overflow: {
		carouselX: number
		pageX: number
		pageY: number
	}
	settled: {
		empty: boolean
		failed: readonly object[]
		loading: readonly object[]
	}
}

export type RouteScreenshotQuality = {
	failures: string[]
	warnings: string[]
}

export type RouteScreenshotFixture = {
	pathname: string
	overlay: {
		routeTitle?: string
		entityType?: string
		required?: readonly string[]
		requiredDt?: readonly string[]
		minDt?: number
		minLinks?: number
		minEntityRows?: number
	}
}

const screenshotBoundaryFailureKinds = new Set([
	'console-failed',
	'console-uncaught',
	'dom-failed',
])

export const routeScreenshotArtifactName = (pathname: string, suffix: string) => {
	const routeSlug = pathname.replace(/^\//u, '').replace(/[^a-z0-9]+/giu, '-').replace(/^-|-$/gu, '')
	return `${routeSlug || 'root'}-${suffix}`
}

export const routeScreenshotCorpusFailures = (
	fixtures: readonly RouteScreenshotFixture[],
): string[] => {
	const failures: string[] = []
	const pathnames = new Set(fixtures.map(({ pathname }) => pathname))
	if (pathnames.size < 2)
		failures.push('representative corpus must contain at least two distinct fixtures')
	for (const { pathname, overlay } of fixtures) {
		const hasVisibleOracle = Boolean(
			overlay.routeTitle
			|| overlay.entityType
			|| overlay.required?.length
			|| overlay.requiredDt?.length
			|| overlay.minDt
			|| overlay.minLinks
			|| overlay.minEntityRows,
		)
		if (!hasVisibleOracle)
			failures.push(`${pathname} has no visible-content oracle`)
	}
	return failures
}

/** Shared visual contract for the route screenshot corpus and its representative E2E suite. */
export const routeScreenshotQuality = ({
	boundaryEvents,
	contentHeight,
	mainText,
	overflow,
	settled,
}: RouteScreenshotQualityInput): RouteScreenshotQuality => {
	const conciseEmpty = contentHeight <= 320
		&& /\bNo .+(?:yet|for this|received)\./iu.test(mainText)
	const conciseNotApplicable = contentHeight <= 320
		&& mainText.includes('This section does not apply to this entity.')
	const failingBoundaryEvents = boundaryEvents.filter(({ kind }) => (
		screenshotBoundaryFailureKinds.has(kind)
	))
	const failures = [
		...(settled.loading.length > 0 ? [`${settled.loading.length} loading boundaries`] : []),
		...(settled.failed.length > 0 ? [`${settled.failed.length} failed boundaries`] : []),
		...(settled.empty ? ['empty main boundary'] : []),
		...(failingBoundaryEvents.length > 0 ? [
			`boundary events: ${failingBoundaryEvents.map(({ kind }) => kind).join(', ')}`,
		] : []),
		...(/^4\d\d\s+Route selector not applicable/u.test(mainText) ? ['route selector not applicable'] : []),
		...(/^5\d\d\s+Internal Error/u.test(mainText) ? ['internal route error'] : []),
		...(mainText === 'Loading...' ? ['main is still loading'] : []),
		...(conciseEmpty ? ['concise empty page'] : []),
		...(conciseNotApplicable ? ['concise not-applicable page'] : []),
		...(contentHeight <= 100 ? [`capture height is ${contentHeight}px`] : []),
		...(
			overflow.pageX === 0 && overflow.pageY === 0 && overflow.carouselX === 0 ?
				[]
			:
				[`capture overflow: pageX=${overflow.pageX}, pageY=${overflow.pageY}, carouselX=${overflow.carouselX}`]
		),
	]

	return {
		failures,
		warnings: [
			...(mainText.includes('This section does not apply to this entity.') ? ['contains not-applicable sections'] : []),
			...(/\b1[5-9]\d{11}\b/u.test(mainText) ? ['shows raw millisecond timestamps'] : []),
			...(/\(\d+\/0\)/u.test(mainText) ? ['shows ambiguous count notation'] : []),
		],
	}
}
