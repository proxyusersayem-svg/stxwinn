class CountdownTimer {
    constructor(durationSeconds, updateCallback, completeCallback) {
        this.duration = durationSeconds;
        this.updateCallback = updateCallback;
        this.completeCallback = completeCallback;
        this.remaining = durationSeconds;
        this.timerInterval = null;
    }
    start() {
        this.remaining = this.duration;
        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.remaining--;
            const mins = Math.floor(this.remaining / 60).toString().padStart(2, '0');
            const secs = (this.remaining % 60).toString().padStart(2, '0');
            this.updateCallback(`${mins}:${secs}`, this.remaining);
            if (this.remaining <= 0) {
                clearInterval(this.timerInterval);
                this.completeCallback();
            }
        }, 1000);
    }
    stop() {
        clearInterval(this.timerInterval);
    }
}
