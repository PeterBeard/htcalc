/**
 * Calculation functions for home theater layout
 */

/**
 * Figure out the optimum viewing distance given a viewing angle and screen size
 */
function computeViewingDistance(viewingAngle, screenSize) {
    // Convert the viewing angle to radians
    const viewingAngleRads = viewingAngle / 180.0 * Math.PI;
    const screenWidth = screenSize / 1.15;
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
    const screenSize = 1.15 * screenWidth;
    return Math.round(screenSize);
}

window.addEventListener('load', function() {
    console.log('Setting up events...');
    document.getElementById('viewing_angle').addEventListener('change', function(e) {
        const viewingAngle = document.getElementById('viewing_angle').value;
        const viewingDistance = document.getElementById('viewing_distance').value;
        const screenSize = document.getElementById('screen_size').value;
        const lastChanged = document.getElementById('last_changed').value;
        if (viewingDistance && screenSize) {
            if (lastChanged === 'viewingDistance') {
                document.getElementById('screen_size').value = computeScreenSize(
                    viewingAngle,
                    viewingDistance
                );
            } else {
                document.getElementById('viewing_distance').value = computeViewingDistance(
                    viewingAngle,
                    screenSize
                );
            }
        } else if (viewingDistance) {
            document.getElementById('screen_size').value = computeScreenSize(
                viewingAngle,
                viewingDistance
            );
        } else if (screenSize) {
            document.getElementById('viewing_distance').value = computeViewingDistance(
                viewingAngle,
                screenSize
            );
        }
    });
    document.getElementById('viewing_distance').addEventListener('change', function(e) {
        const viewingAngle = document.getElementById('viewing_angle').value;
        const viewingDistance = document.getElementById('viewing_distance').value;
        document.getElementById('screen_size').value = computeScreenSize(
            viewingAngle,
            viewingDistance
        );
        document.getElementById('last_changed').value = 'viewingDistance';
    });
    document.getElementById('screen_size').addEventListener('change', function(e) {
        const viewingAngle = document.getElementById('viewing_angle').value;
        const screenSize = document.getElementById('screen_size').value;
        document.getElementById('viewing_distance').value = computeViewingDistance(
            viewingAngle,
            screenSize
        );
        document.getElementById('last_changed').value = 'screenSize';
    });
    console.log('htCalc is ready.');
});
