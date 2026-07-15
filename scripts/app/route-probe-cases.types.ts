type RouteSegmentParamName<_Segment extends string> = (
	_Segment extends `${string}[${infer _Param}]${infer _Rest}` ?
		| (
			_Param extends `...${infer _RestParam}` ?
				_RestParam extends `${infer _ParamName}=${string}` ?
					_ParamName
				:
					_RestParam
			:
				_Param extends `${infer _ParamName}=${string}` ?
					_ParamName
				:
					_Param
		)
		| RouteSegmentParamName<_Rest>
	:
		never
)

type RouteProbeNodeConstraint<
	_Node,
	_AncestorParamName extends string,
> = {
	selectors?: _Node extends {
		selectors?: infer _Selectors
	} ? {
		readonly [_EntityType in keyof NonNullable<_Selectors>]: {
			readonly [_SelectorName in keyof NonNullable<_Selectors>[_EntityType]]: {
				probeCases: NonNullable<_Selectors>[_EntityType][_SelectorName] extends {
					probeCases: infer _ProbeCases
				} ? _ProbeCases extends readonly [unknown, ...unknown[]] ? {
					readonly [_Index in keyof _ProbeCases]: _ProbeCases[_Index] extends {
						id: string
						params: infer _Params extends Readonly<Record<string, string>>
					} ? [
						Exclude<keyof _Params, _AncestorParamName>,
						Exclude<_AncestorParamName, keyof _Params>,
					] extends [never, never] ?
						_ProbeCases[_Index]
					:
						never
					:
						never
				}
				:
					readonly [never]
				:
					readonly [never]
			}
		}
	}
	:
		never
	children?: _Node extends {
		children?: infer _Children
	} ? {
		readonly [_Segment in keyof NonNullable<_Children>]: RouteProbeNodeConstraint<
			NonNullable<_Children>[_Segment],
			| _AncestorParamName
			| RouteSegmentParamName<Extract<_Segment, string>>
		>
	}
	:
		never
}

type RouteProbeMapping = {
	probeCases: readonly [{
		id: string
		params: Readonly<Record<string, string>>
	}, ...{
		id: string
		params: Readonly<Record<string, string>>
	}[]]
}

type RouteProbeNode = {
	selectors?: Readonly<Record<string, Readonly<Record<string, RouteProbeMapping>>>>
	children?: Readonly<Record<string, RouteProbeNode>>
}

export const defineRoutes = <const _Schema>(_schema: _Schema) => <const _Routes extends {
	children: Readonly<Record<string, RouteProbeNode>>
}>(
	routes: _Routes & (
		NoInfer<_Routes> extends {
			children: {
				readonly [_Segment in keyof NoInfer<_Routes>['children']]: RouteProbeNodeConstraint<
					NoInfer<_Routes>['children'][_Segment],
					RouteSegmentParamName<Extract<_Segment, string>>
				>
			}
		} ?
			unknown
		:
			never
	)
) => routes
