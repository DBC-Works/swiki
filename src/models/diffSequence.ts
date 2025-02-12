/**
 * Direction type
 */
const DirectionTypes = {
  /**
   * X coordinate
   */
  X: 'X',

  /**
   * Y coordinate
   */
  Y: 'Y',

  /**
   * XY coordinate
   */
  XY: 'XY',
} as const satisfies Record<string, string>
type DirectionType = (typeof DirectionTypes)[keyof typeof DirectionTypes]

/**
 * Node info
 */
type NodeInfo = {
  /**
   * Y
   */
  y: number

  /**
   * Directions
   */
  directions: DirectionType[]
}

/**
 * Get node info
 * @param v Visited node info
 * @param index Index
 * @returns Node info
 */
const getNodeInfo = (visited: Map<number, NodeInfo>, index: number): NodeInfo =>
  visited.get(index) ?? {
    y: 0,
    directions: [],
  }

/**
 * Make node info
 * @param m X axis length
 * @param n Y axis length
 * @param d Levenshtein distance
 * @param k End point of the diagonal
 * @param visited Visited node info
 * @returns Node info
 */
const makeNodeInfo = (
  m: number,
  n: number,
  d: number,
  k: number,
  visited: Map<number, NodeInfo>,
): NodeInfo => {
  if (d === 0) {
    return {
      y: 0,
      directions: [],
    }
  }

  const nextNode = getNodeInfo(visited, k + 1)
  const prevNode = getNodeInfo(visited, k - 1)
  let prev: boolean
  if (k <= -d || k <= -n) {
    prev = false
  } else if (d <= k || m <= k) {
    prev = true
  } else {
    prev = nextNode.y < prevNode.y
  }

  return prev
    ? {
        y: prevNode.y,
        directions: [...prevNode.directions, DirectionTypes.X],
      }
    : {
        y: nextNode.y + 1,
        directions: [...nextNode.directions, DirectionTypes.Y],
      }
}

/**
 * Move node diagonal
 * @param xValues X axis values
 * @param yValues Y axis values
 * @param k End point of the diagonal
 * @param current Current node info
 * @returns Moved node info
 */
const snake = (xValues: string[], yValues: string[], k: number, current: NodeInfo) => {
  const moved = {
    x: k + current.y,
    y: current.y,
    directions: [...current.directions],
  }
  while (
    moved.x < xValues.length &&
    moved.y < yValues.length &&
    xValues[moved.x] === yValues[moved.y]
  ) {
    moved.directions.push(DirectionTypes.XY)
    ++moved.x
    ++moved.y
  }
  return moved
}

/**
 * Find edit graph
 * @param xValues X axis values
 * @param yValues Y axis values
 * @returns Directions
 */
const findEditGraph = (xValues: string[], yValues: string[]): DirectionType[] => {
  let directions: DirectionType[] = []

  const visited = new Map<number, NodeInfo>()
  const m = xValues.length
  const n = yValues.length
  for (let d = 0; d <= m + n && directions.length === 0; ++d) {
    const kValues = Array.from({ length: 2 * d + 1 }, (_, index) => -d + index).filter(
      (k, index) => index % 2 === 0 && -n <= k && k <= m,
    )
    for (const k of kValues) {
      const moved = snake(xValues, yValues, k, makeNodeInfo(m, n, d, k, visited))
      if (m <= moved.x && n <= moved.y) {
        directions = moved.directions
        break
      }
      visited.set(k, { y: moved.y, directions: moved.directions })
    }
  }
  return directions
}

/**
 * Subsequence type
 */
export const SubsequenceTypes = {
  /**
   * Keep
   */
  Keep: 'Keep',

  /**
   * Deleted
   */
  Deleted: 'Deleted',

  /**
   * Added
   */
  Added: 'Added',
} as const satisfies Record<string, string>
export type SubsequenceType = (typeof SubsequenceTypes)[keyof typeof SubsequenceTypes]

/**
 * Subsequence info
 */
export type Subsequence = {
  /**
   * Type
   */
  type: SubsequenceType

  /**
   * Sequence
   */
  sequence: string[]
}

/**
 * Append line to subsequences
 * @param type Sequence type
 * @param line Line to append
 * @param subsequences Subsequences to update
 */
const appendLineToSubsequences = (
  type: SubsequenceType,
  line: string,
  subsequences: Subsequence[],
) => {
  const subsequence = subsequences.at(-1)
  if (subsequence?.type === type) {
    subsequence.sequence.push(line)
  } else {
    subsequences.push({
      type,
      sequence: [line],
    })
  }
}

/**
 * Generate difference sequence(base on Myers O(ND) algorithm)
 * @see {@link https://gist.github.com/gurimusan/7e554eb12f9f59880053|diffってなんだ.md}
 * @param previousText Previous text
 * @param currentText Current text
 * @returns Difference sequence
 */
export const generateDiffSequence = (
  previousText: string[],
  currentText: string[],
): Subsequence[] => {
  const subsequences: Subsequence[] = []

  let x = 0
  let y = 0
  for (const direction of findEditGraph(previousText, currentText)) {
    switch (direction) {
      case DirectionTypes.XY:
        appendLineToSubsequences(SubsequenceTypes.Keep, previousText[x], subsequences)
        ++x
        ++y
        break
      case DirectionTypes.X:
        appendLineToSubsequences(SubsequenceTypes.Deleted, previousText[x], subsequences)
        ++x
        break
      case DirectionTypes.Y:
        appendLineToSubsequences(SubsequenceTypes.Added, currentText[y], subsequences)
        ++y
        break
    }
  }
  return subsequences
}
