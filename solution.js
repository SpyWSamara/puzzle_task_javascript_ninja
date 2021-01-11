function solvePuzzle(pieces) {
  console.time('solvePuzzle');
  const piecesList = pieces.map(piece => {
    return {
      id: piece.id,
      left: piece.edges.left ? piece.edges.left.edgeTypeId : null,
      top: piece.edges.top ? piece.edges.top.edgeTypeId : null,
      right: piece.edges.right ? piece.edges.right.edgeTypeId : null,
      bottom: piece.edges.bottom ? piece.edges.bottom.edgeTypeId : null,
    };
  });

  const firstRotate = piece => {
    if (!piece.top && !piece.left) {
      return rotate(piece, 0);
    } else if (!piece.top) {
      return rotate(piece, -1);
    } else if (!piece.left) {
      return rotate(piece, 1);
    }
    return piece;
  };

  const pieceRotate = (piece, value, needDirection) => {
    if (value !== piece[needDirection]) {
      let turns;
      if (value === piece.left) {
        turns = {
          top: 1,
          bottom: -1,
          right: 0,
        };
      } else if (value === piece.top) {
        turns = {
          left: -1,
          bottom: 0,
          right: 1,
        };
      } else if (value === piece.right) {
        turns = {
          left: 0,
          bottom: 1,
          top: -1,
        };
      } else if (value === piece.bottom) {
        turns = {
          left: 1,
          top: 0,
          right: -1,
        };
      }
      piece = rotate(piece, turns[needDirection]);
    }
    return piece;
  };

  const rotate = (piece, turn) => {
    if (0 === turn) {
      [piece.top, piece.right, piece.bottom, piece.left] = [piece.bottom, piece.left, piece.top, piece.right];
    } else if (-1 === turn) {
      [piece.top, piece.right, piece.bottom, piece.left] = [piece.right, piece.bottom, piece.left, piece.top];
    } else if (1 === turn) {
      [piece.top, piece.right, piece.bottom, piece.left] = [piece.left, piece.top, piece.right, piece.bottom];
    }
    return piece;
  };

  const buildTree = (leaf, list) => {
    if (leaf.bottom) {
      let bottom = list.filter(piece => {
        return piece.left === leaf.bottom || piece.top === leaf.bottom || piece.right === leaf.bottom || piece.bottom === leaf.bottom;
      }).pop();
      if (bottom) {
        bottom = pieceRotate(bottom, leaf.bottom, 'top');
        list.splice(list.findIndex(item => item.id === bottom.id), 1)
        leaf.bottom = buildTree(bottom, list);
      } else {
        delete(leaf.bottom);
      }
    }
    if (leaf.right) {
      let right = list.filter(piece => {
        return piece.left === leaf.right || piece.top === leaf.right || piece.right === leaf.right || piece.bottom === leaf.right;
      }).pop();
      if (right) {
        right = pieceRotate(right, leaf.right, 'left');
        list.splice(list.findIndex(item => item.id === right.id), 1);
        leaf.right = buildTree(right, list);
      } else {
        delete(leaf.right);
      }
    }

    delete(leaf.top);
    delete(leaf.left);

    return leaf;
  };

  const resolve = (tree, result) => {
    result.push(tree.id);
    if (tree.right) {
      resolve(tree.right, result);
    }
    if (tree.bottom) {
      resolve(tree.bottom, result);
    }

    return result;
  };

  const tree = buildTree(firstRotate(piecesList.shift()), piecesList);

  const result = resolve(tree, []);

  console.timeEnd('solvePuzzle');

  // TODO: from time to time have wrong rows in resolve
  return result;
}

// Не удаляйте эту строку
window.solvePuzzle = solvePuzzle;