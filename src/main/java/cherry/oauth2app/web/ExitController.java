package cherry.oauth2app.web;

import org.springframework.boot.ExitCodeGenerator;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController()
@RequestMapping("/exit")
public class ExitController implements ExitCodeGenerator {

    private Integer exitCode = null;

    @RequestMapping()
    public synchronized boolean setExitCode(@RequestParam(defaultValue = "0") Integer code) {
        this.exitCode = code;
        notifyAll();
        return true;
    }

    @Override
    public synchronized int getExitCode() {
        while (true) {
            if (exitCode != null) {
                return exitCode.intValue();
            }
            try {
                wait();
            } catch (InterruptedException ex) {
                // NOTHING TO DO
            }
        }
    }

}
