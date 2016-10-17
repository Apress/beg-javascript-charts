function randomCentroids(points, k) {
    var centroids = points.slice(0);
    centroids.sort(function() {
       return (Math.round(Math.random()) - 0.5);
    });
    return centroids.slice(0, k);
}

function distance(v1, v2) {
      var total = 0;
      for (var i = 0; i < v1.length; i++) {
         total += Math.pow(v2[i] - v1[i], 2);
      }
      return Math.sqrt(total);
};

function closestCentroid(point, centroids) {
    var min = Infinity;
    var index = 0;
    for (var i = 0; i < centroids.length; i++) {
       var dist = distance(point, centroids[i]);
       if (dist < min) {
          min = dist;
          index = i;
       }
    }
    return index;
}

function kmeans(points, k) {
    var centroids = randomCentroids(points, k);
    var assignment = new Array(points.length);
    var clusters = new Array(k);
    var movement = true;
    while (movement) {
      for (var i = 0; i < points.length; i++) {
         assignment[i] = closestCentroid(points[i], centroids);
      }
      movement = false;
      for (var j = 0; j < k; j++) {
         var assigned = [];
         for (var i = 0; i < assignment.length; i++) {
            if (assignment[i] == j) {
               assigned.push(points[i]);
            }
         }
         if (!assigned.length) {
            continue;
         }
         var centroid = centroids[j];
         var newCentroid = new Array(centroid.length);
         for (var g = 0; g < centroid.length; g++) {
            var sum = 0;
            for (var i = 0; i < assigned.length; i++) {
               sum += assigned[i][g];
            }
            newCentroid[g] = sum / assigned.length;
            if (newCentroid[g] != centroid[g]) {
               movement = true;
            }
         }
         centroids[j] = newCentroid;
         clusters[j] = assigned;
       }
    }
    return clusters;
}

