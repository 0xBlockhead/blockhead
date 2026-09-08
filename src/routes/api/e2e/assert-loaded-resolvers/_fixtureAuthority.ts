export type ResolverFixtureCoordinate<_Selector> = {
	entityType: string
	selectorName: string
	source: string
	affectedCaseCount: number
	appliesTo: (selectorName: string, selector: _Selector) => boolean
}

export type ResolverFixtureAdmission<_Probe, _Selector> =
	| { kind: 'Applicable', probe: _Probe, entitySelector: _Selector }
	| { kind: 'Inapplicable', probe: _Probe, entitySelector: _Selector }
	| { kind: 'Missing', probe: _Probe, error: string }

/**
	* Resolve each typed identity once, then apply the resolver's own applicability
	* contract before any provider execution. Missing identities remain owner debt;
	* inapplicable identities are an explicit exclusion, never an execution failure.
	*/
export const admitResolverFixtures = async <
	_Selector,
	_Probe extends ResolverFixtureCoordinate<_Selector>,
>(
	probes: readonly _Probe[],
	resolveFixture: (probe: _Probe) => _Selector | Promise<_Selector>
): Promise<ResolverFixtureAdmission<_Probe, _Selector>[]> => Promise.all(probes.map(
	async (probe) => {
		let entitySelector: _Selector
		try {
			entitySelector = await resolveFixture(probe)
		} catch (error) {
			return {
				kind: 'Missing' as const,
				probe,
				error: error instanceof Error ? error.message : String(error),
			}
		}

		return probe.appliesTo(probe.selectorName, entitySelector) ?
			{ kind: 'Applicable' as const, probe, entitySelector }
		:
			{ kind: 'Inapplicable' as const, probe, entitySelector }
	}
))
