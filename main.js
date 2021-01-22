/**
 * Calculation functions for home theater layout
 */

/**
 * Get the currently selected aspect ratio
 */
function getAspectRatio() {
    const value = document.querySelector('input[name="aspect"]:checked').value.split(':');
    const width = Number(value[0]);
    const height = Number(value[1]);
    return width / height;
}

/**
 * Convert a diagonal screen size to the screen width using the given aspect ratio
 */
function diagonalToWidth(screenSize, aspectRatio) {
    const hyp = Math.sqrt(aspectRatio * aspectRatio + 1);
    const width = screenSize * aspectRatio / hyp;
    return width;
}

/**
 * Convert a screen width to the diagonal screen size using the given aspect ratio
 */
function widthToDiagonal(screenSize, aspectRatio) {
    const hyp = Math.sqrt(aspectRatio * aspectRatio + 1);
    const diagonal = screenSize / aspectRatio * hyp;
    return diagonal;
}

/**
 * Figure out the optimum viewing distance given a viewing angle and screen size
 */
function computeViewingDistance(viewingAngle, screenSize) {
    // Convert the viewing angle to radians
    const viewingAngleRads = viewingAngle / 180.0 * Math.PI;
    const screenWidth = diagonalToWidth(screenSize, getAspectRatio());
    const viewingDistance = screenWidth / (2.0 * Math.tan(viewingAngleRads / 2.0));
    return Math.round(viewingDistance);
}

/**
 * Figure out the optimum screen size given a viewing angle and viewing distance
 */
function computeScreenSize(viewingAngle, viewingDistance) {
    // Convert viewing angle to radians
    const viewingAngleRads = viewingAngle / 180.0 * Math.PI;
    const screenWidth = Math.tan(viewingAngleRads / 2.0) * 2.0 * viewingDistance;
    const screenSize = widthToDiagonal(screenWidth, getAspectRatio());
    return Math.round(screenSize);
}

/**
 * Determine the best resolution for the given screen size and viewing distance
 * (assumes visual acuity of 1/60 degree)
 */
function computeOptimalResolution(screenSize, viewingDistance) {
    // Figure out the screen's viewing angle
    const screenWidth = diagonalToWidth(screenSize, getAspectRatio());
    const degToRad = 180.0 / Math.PI;
    const viewingAngle = 2.0 * degToRad * Math.atan((screenWidth / 2.0) / viewingDistance);
    // Multiply the viewing angle by 60 to figure out the number of horizontal pixels
    const pixelCount = viewingAngle * 60.0;
    if (pixelCount <= 640) {
        return '480p';
    } else if (pixelCount <= 1280) {
        return '720p';
    } else if (pixelCount <= 1920) {
        return '1080p';
    } else if (pixelCount <= 3840) {
        return '4k';
    } else {
        return '8k';
    }
}

/**
 * Recompute the screen size or viewing distance
 */
function recompute(e) {
    let viewingAngle = document.getElementById('viewing_angle').value;
    let viewingDistance = document.getElementById('viewing_distance').value;
    let screenSize = document.getElementById('screen_size').value;
    const lastChanged = document.getElementById('last_changed').value;
    if (viewingDistance && screenSize) {
        if (lastChanged === 'viewingDistance') {
            screenSize = computeScreenSize(
                viewingAngle,
                viewingDistance
            );
            document.getElementById('screen_size').value = screenSize;
        } else {
            viewingDistance = computeViewingDistance(
                viewingAngle,
                screenSize
            );
            document.getElementById('viewing_distance').value = viewingDistance;
        }
    } else if (viewingDistance) {
        screenSize = computeScreenSize(
            viewingAngle,
            viewingDistance
        );
        document.getElementById('screen_size').value = screenSize;
    } else if (screenSize) {
        viewingDistance = computeViewingDistance(
            viewingAngle,
            screenSize
        );
        document.getElementById('viewing_distance').value = viewingDistance;
    } else {
        console.log('Not enough info to recompute');
    }
    document.getElementById('optimal_resolution').innerHTML = computeOptimalResolution(
        screenSize, viewingDistance);
}

window.addEventListener('load', function() {
    console.log('Setting up events...');
    document.getElementById('viewing_angle').addEventListener('change', recompute);
    document.getElementById('aspect_43').addEventListener('change', recompute);
    document.getElementById('aspect_169').addEventListener('change', recompute);
    document.getElementById('aspect_2391').addEventListener('change', recompute);
    document.getElementById('viewing_distance').addEventListener('change', function(e) {
        const viewingAngle = document.getElementById('viewing_angle').value;
        const viewingDistance = document.getElementById('viewing_distance').value;
        const screenSize = computeScreenSize(
            viewingAngle,
            viewingDistance
        );
        document.getElementById('screen_size').value = screenSize;
        document.getElementById('optimal_resolution').innerHTML = computeOptimalResolution(
            screenSize, viewingDistance);
        document.getElementById('last_changed').value = 'viewingDistance';
    });
    document.getElementById('screen_size').addEventListener('change', function(e) {
        const viewingAngle = document.getElementById('viewing_angle').value;
        const screenSize = document.getElementById('screen_size').value;
        const viewingDistance = computeViewingDistance(
            viewingAngle,
            screenSize
        );
        document.getElementById('viewing_distance').value = viewingDistance;
        document.getElementById('optimal_resolution').innerHTML = computeOptimalResolution(
            screenSize, viewingDistance);
        document.getElementById('last_changed').value = 'screenSize';
    });
    console.log('htCalc is ready.');
});
