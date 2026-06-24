<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
		closed: [],
		content: {
			dl: [
				[
					'standard',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'timestamps',
					when: 'open',
					items: [
						'$$timestamps',
					],
				},
				{
					label: 'issuer powers',
					when: 'open',
					items: [
						'$$issuerPowers',
					],
				},
				{
					label: 'claim requirements',
					when: 'open',
					items: [
						'$$claimRequirements',
					],
				},
				{
					label: 'trusted issuers',
					when: 'open',
					items: [
						'$$trustedIssuers',
					],
				},
				{
					label: 'compliance modules',
					when: 'open',
					items: [
						'$$complianceModules',
					],
				},
				{
					label: 'restrictions',
					when: 'open',
					items: [
						'$$restrictions',
					],
				},
			],
		},
	} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.RegulatedAssetProfile>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.RegulatedAssetProfile}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
